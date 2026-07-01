import { startTransition, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiFileText,
  FiLayers,
  FiMessageSquare,
  FiRefreshCw,
  FiUploadCloud
} from "react-icons/fi";

import {
  downloadPdfDocument,
  downloadRemoteFile,
  sanitizeFilename
} from "../utils/downloads";

const INITIAL_ASSISTANT_MESSAGE =
  "Upload a contract to begin. Run a single review or a dual-contract comparison, then ask focused questions about clauses, obligations, and risk exposure.";

function formatFileSize(file) {
  if (!file) {
    return "PDF upload";
  }

  const sizeInKb = file.size / 1024;

  if (sizeInKb >= 1024) {
    return `${(sizeInKb / 1024).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(sizeInKb))} KB`;
}

function getRiskTone(level) {
  const normalized = String(level || "").toLowerCase();

  if (normalized === "high") {
    return "high";
  }

  if (normalized === "medium") {
    return "medium";
  }

  return "healthy";
}

function buildComparisonPayload(responseData, primaryName, comparisonName) {
  const riskBreakdown = responseData.risk_breakdown || {};
  const insights = Array.isArray(responseData.insights) ? responseData.insights : [];
  const primaryClauses = responseData.contracts?.primary_clauses ?? 0;
  const comparisonClauses = responseData.contracts?.comparison_clauses ?? 0;
  const totalIssues = responseData.total_issues ?? insights.length;

  return {
    kind: "comparison",
    title: "Comparison Report",
    headline: `${primaryName} versus ${comparisonName}`,
    summary: `Comparison complete. ${totalIssues} clause differences were identified across ${primaryClauses} primary clauses and ${comparisonClauses} comparison clauses.`,
    reportPath: responseData.report_generated,
    reportFilename: responseData.report_filename,
    metrics: [
      {
        label: "Primary Clauses",
        value: primaryClauses
      },
      {
        label: "Comparison Clauses",
        value: comparisonClauses
      },
      {
        label: "Issues Identified",
        value: totalIssues
      },
      {
        label: "High Risk Findings",
        value: riskBreakdown.high ?? 0
      }
    ],
    riskBreakdown,
    insights
  };
}

function buildAnalysisPayload(responseData) {
  const categoryBreakdown = responseData.category_breakdown || {};
  const topCategories = Object.entries(categoryBreakdown)
    .sort((left, right) => Number(right[1]) - Number(left[1]))
    .slice(0, 4);

  return {
    kind: "analysis",
    title: "Contract Review",
    headline: responseData.filename || "Uploaded contract",
    summary: `Contract processed successfully. ${responseData.total_clauses ?? 0} clauses were extracted and the workspace is ready for deeper questions.`,
    metrics: [
      {
        label: "Total Clauses",
        value: responseData.total_clauses ?? 0
      },
      {
        label: "Categories Found",
        value: Object.keys(categoryBreakdown).length
      },
      {
        label: "Preview Clauses",
        value: Array.isArray(responseData.sample_output) ? responseData.sample_output.length : 0
      }
    ],
    categoryBreakdown,
    topCategories,
    sampleOutput: Array.isArray(responseData.sample_output) ? responseData.sample_output : []
  };
}

function createPdfSectionsFromPayload(payload, chatMessages) {
  if (!payload) {
    return [];
  }

  const sections = [
    {
      heading: "Overview",
      body: payload.summary
    }
  ];

  if (Array.isArray(payload.metrics)) {
    sections.push({
      heading: "Key Metrics",
      bullets: payload.metrics.map((metric) => `${metric.label}: ${metric.value}`)
    });
  }

  if (payload.kind === "comparison") {
    sections.push({
      heading: "Risk Breakdown",
      bullets: [
        `High: ${payload.riskBreakdown?.high ?? 0}`,
        `Medium: ${payload.riskBreakdown?.medium ?? 0}`,
        `Low: ${payload.riskBreakdown?.low ?? 0}`
      ]
    });

    sections.push({
      heading: "Top Findings",
      bullets: (payload.insights || []).slice(0, 8).map((item) => (
        `${item.risk_level} risk | Similarity ${item.similarity_score}: ${item.issue}. Recommendation: ${item.recommendation}`
      ))
    });
  }

  if (payload.kind === "analysis") {
    sections.push({
      heading: "Category Breakdown",
      bullets: Object.entries(payload.categoryBreakdown || {}).map(([category, count]) => `${category}: ${count}`)
    });

    sections.push({
      heading: "Clause Preview",
      bullets: (payload.sampleOutput || []).map((item) => `${item.category}: ${item.text}`)
    });
  }

  const assistantMessages = chatMessages
    .filter((message) => message.role === "assistant")
    .slice(-3)
    .map((message) => message.content);

  if (assistantMessages.length) {
    sections.push({
      heading: "Recent Assistant Output",
      body: assistantMessages.join("\n\n")
    });
  }

  return sections;
}

function ContractUpload({ onProcessingComplete }) {
  const [primaryContract, setPrimaryContract] = useState(null);
  const [comparisonContract, setComparisonContract] = useState(null);
  const [analysisResult, setAnalysisResult] = useState("");
  const [resultPayload, setResultPayload] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: INITIAL_ASSISTANT_MESSAGE
    }
  ]);
  const [chatQuestion, setChatQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadVersion, setUploadVersion] = useState(0);

  const threadRef = useRef(null);

  useEffect(() => {
    if (!threadRef.current) {
      return;
    }

    threadRef.current.scrollTo({
      top: threadRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [chatMessages, isProcessing]);

  const resetConversation = () => {
    setAnalysisResult("");
    setResultPayload(null);
    setChatMessages([
      {
        role: "assistant",
        content: INITIAL_ASSISTANT_MESSAGE
      }
    ]);
    setChatQuestion("");
  };

  const clearWorkspace = () => {
    setPrimaryContract(null);
    setComparisonContract(null);
    setUploadVersion((version) => version + 1);
    resetConversation();
  };

  const handlePrimaryChange = (event) => {
    const file = event.target.files[0] || null;
    setPrimaryContract(file);
    resetConversation();
  };

  const handleComparisonChange = (event) => {
    const file = event.target.files[0] || null;
    setComparisonContract(file);
    resetConversation();
  };

  const appendChatMessage = (role, content) => {
    startTransition(() => {
      setChatMessages((messages) => [
        ...messages,
        {
          role,
          content
        }
      ]);
    });
  };

  const uploadContract = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post("http://localhost:8000/upload", formData);
    return response.data;
  };

  const buildContractPrompt = (question) => {
    const contractNames = primaryContract
      ? `${primaryContract.name}${comparisonContract ? ` vs ${comparisonContract.name}` : ""}`
      : "No contract uploaded yet";
    const resultSummary = analysisResult || "No contract analysis has been run yet.";

    return `The user is working in the Contracts tab.

Uploaded Contract(s): ${contractNames}

Current Result:
${resultSummary}

Question:
${question}

Answer the question clearly and professionally, based only on the uploaded contract workspace and analysis result.`;
  };

  const handleProcess = async () => {
    if (!primaryContract) {
      alert("Please upload a primary contract first.");
      return;
    }

    setIsProcessing(true);
    setAnalysisResult("");

    try {
      if (comparisonContract) {
        const formData = new FormData();
        formData.append("file1", primaryContract);
        formData.append("file2", comparisonContract);

        const response = await axios.post("http://localhost:8000/compare", formData);
        const payload = buildComparisonPayload(response.data, primaryContract.name, comparisonContract.name);

        startTransition(() => {
          setResultPayload(payload);
          setAnalysisResult(payload.summary);
        });

        appendChatMessage(
          "assistant",
          `${payload.summary}\n\nHigh risk findings: ${payload.riskBreakdown.high ?? 0}\nMedium risk findings: ${payload.riskBreakdown.medium ?? 0}\nLow risk findings: ${payload.riskBreakdown.low ?? 0}`
        );
      } else {
        const response = await uploadContract(primaryContract);
        const payload = buildAnalysisPayload(response);

        startTransition(() => {
          setResultPayload(payload);
          setAnalysisResult(payload.summary);
        });

        appendChatMessage("assistant", payload.summary);
      }

      if (onProcessingComplete) {
        Promise.resolve(onProcessingComplete()).catch((error) => {
          console.error("Unable to refresh workspace after processing:", error);
        });
      }
    } catch (error) {
      console.error(error);
      const message = "Unable to process this contract. Please confirm the backend is running and retry.";
      setAnalysisResult(message);
      appendChatMessage("assistant", message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAskQuestion = async () => {
    const question = chatQuestion.trim();

    if (!analysisResult) {
      alert("Please process a contract first before asking questions.");
      return;
    }

    if (!question || isProcessing) {
      return;
    }

    appendChatMessage("user", question);
    setChatQuestion("");
    setIsProcessing(true);

    try {
      const response = await axios.post("http://localhost:8000/chat", {
        query: buildContractPrompt(question)
      });

      appendChatMessage("assistant", response.data.response);
    } catch (error) {
      console.error(error);
      appendChatMessage(
        "assistant",
        "I could not reach the AI service. Please confirm the backend and local LLM are running."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestedAction = async (prompt) => {
    if (!analysisResult) {
      alert("Please process a contract first to use quick actions.");
      return;
    }

    appendChatMessage("user", prompt);
    setIsProcessing(true);

    try {
      const response = await axios.post("http://localhost:8000/chat", {
        query: buildContractPrompt(prompt)
      });

      appendChatMessage("assistant", response.data.response);
    } catch (error) {
      console.error(error);
      appendChatMessage(
        "assistant",
        "I could not reach the AI service. Please confirm the backend and local LLM are running."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!resultPayload) {
      return;
    }

    if (resultPayload.kind === "comparison" && resultPayload.reportPath) {
      try {
        const filename = resultPayload.reportFilename || `${sanitizeFilename(resultPayload.headline, "comparison_report")}.pdf`;
        await downloadRemoteFile(
          `http://localhost:8000/compare-report?path=${encodeURIComponent(resultPayload.reportPath)}`,
          filename
        );
        return;
      } catch (error) {
        console.error("Unable to download backend comparison PDF, falling back to client export.", error);
      }
    }

    downloadPdfDocument({
      filename: `${sanitizeFilename(resultPayload.headline, "contract_report")}.pdf`,
      title: resultPayload.title,
      sections: createPdfSectionsFromPayload(resultPayload, chatMessages)
    });
  };

  const workspaceStatus = !primaryContract
    ? {
        label: "Awaiting upload",
        tone: "neutral"
      }
    : comparisonContract
      ? {
          label: "Comparison armed",
          tone: "info"
        }
      : analysisResult
        ? {
            label: "Context ready",
            tone: "healthy"
          }
        : {
            label: "Ready to analyze",
            tone: "info"
          };

  return (
    <section className="contract-studio">
      <div className="contract-studio-grid">
        <div className="contract-studio-rail">
          <article className="section-card intake-hero-card">
            <div className="card-header">
              <div>
                <p className="ey-kicker">Contract Comparison</p>
                <h3 className="card-title">Review intake rail</h3>
                <p className="card-subtitle">
                  Upload the governing agreement, add a comparison version when needed, and launch a cleaner end-user review surface.
                </p>
              </div>
              <span className={`status-pill status-pill--${workspaceStatus.tone}`}>{workspaceStatus.label}</span>
            </div>

            <div className="file-slot-grid">
              <div className={`file-slot ${primaryContract ? "is-ready" : ""}`}>
                <div className="file-slot-header">
                  <div className="file-slot-icon">
                    <FiFileText />
                  </div>
                  <div>
                    <div className="file-slot-label">Primary Contract</div>
                    <div className="file-slot-value">{primaryContract ? primaryContract.name : "Upload the governing agreement"}</div>
                  </div>
                </div>
                <div className="file-slot-meta">{primaryContract ? formatFileSize(primaryContract) : "Required to start analysis"}</div>
              </div>

              <div className={`file-slot ${comparisonContract ? "is-ready" : ""}`}>
                <div className="file-slot-header">
                  <div className="file-slot-icon">
                    <FiLayers />
                  </div>
                  <div>
                    <div className="file-slot-label">Comparison Contract</div>
                    <div className="file-slot-value">{comparisonContract ? comparisonContract.name : "Optional second document"}</div>
                  </div>
                </div>
                <div className="file-slot-meta">{comparisonContract ? formatFileSize(comparisonContract) : "Use this to create a clause-by-clause report"}</div>
              </div>
            </div>

            <div className="upload-actions">
              <label className="upload-button">
                <FiUploadCloud />
                Upload Primary
                <input key={`primary-${uploadVersion}`} type="file" accept=".pdf" onChange={handlePrimaryChange} />
              </label>

              <label className="upload-button upload-button--secondary">
                <FiLayers />
                Upload Comparison
                <input key={`comparison-${uploadVersion}`} type="file" accept=".pdf" onChange={handleComparisonChange} />
              </label>
            </div>

            <div className="workflow-strip">
              <div className="workflow-step">
                <span className="workflow-step-number">1</span>
                <div>
                  <div className="workflow-step-title">Upload</div>
                  <div className="workflow-step-copy">Stage one or two contracts for review.</div>
                </div>
              </div>
              <div className="workflow-step">
                <span className="workflow-step-number">2</span>
                <div>
                  <div className="workflow-step-title">Generate</div>
                  <div className="workflow-step-copy">Create a comparison or analysis report.</div>
                </div>
              </div>
              <div className="workflow-step">
                <span className="workflow-step-number">3</span>
                <div>
                  <div className="workflow-step-title">Download</div>
                  <div className="workflow-step-copy">Export the current report as PDF for sharing.</div>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="primary-button" type="button" onClick={handleProcess} disabled={isProcessing || !primaryContract}>
                {comparisonContract ? "Generate Comparison" : "Run AI Review"}
                <FiArrowRight />
              </button>
              <button className="secondary-button" type="button" onClick={clearWorkspace}>
                <FiRefreshCw />
                Clear Workspace
              </button>
            </div>
          </article>
        </div>

        <div className="contract-main-stage">
          <article className="section-card report-stage-card">
            <div className="card-header">
              <div>
                <p className="ey-kicker">Report Surface</p>
                <h3 className="card-title">{resultPayload?.title || "Comparison and review report"}</h3>
                <p className="card-subtitle">
                  The main result surface stays visible here so end users see the report first, with the chat as a supporting assistant.
                </p>
              </div>

              <div className="report-stage-actions">
                <div className="signal-chip">
                  <FiClock />
                  {isProcessing ? "Generating..." : "Ready"}
                </div>
                <button className="secondary-button" type="button" onClick={handleDownloadPdf} disabled={!resultPayload}>
                  <FiDownload />
                  Download PDF
                </button>
              </div>
            </div>

            {!resultPayload ? (
              <div className="empty-state report-empty-state">
                Upload a contract and generate an analysis or comparison. The finished report will take over this stage and stay available while you move around the workspace.
              </div>
            ) : (
              <div className="report-stage-body">
                <div className="report-stage-hero">
                  <div>
                    <div className="report-stage-title">{resultPayload.headline}</div>
                    <p className="report-stage-summary">{resultPayload.summary}</p>
                  </div>
                  <span className={`status-pill status-pill--${resultPayload.kind === "comparison" ? "info" : "healthy"}`}>
                    {resultPayload.kind === "comparison" ? "Comparison report" : "Contract review"}
                  </span>
                </div>

                <div className="report-metric-grid">
                  {resultPayload.metrics?.map((metric) => (
                    <article className="report-metric-card" key={metric.label}>
                      <div className="report-metric-label">{metric.label}</div>
                      <div className="report-metric-value">{metric.value}</div>
                    </article>
                  ))}
                </div>

                {resultPayload.kind === "comparison" ? (
                  <div className="comparison-report-layout">
                    <section className="comparison-risk-card">
                      <div className="adaptive-subsection-title">Risk distribution</div>
                      <div className="comparison-risk-grid">
                        {["high", "medium", "low"].map((level) => (
                          <div className={`comparison-risk-tile comparison-risk-tile--${level}`} key={level}>
                            <div className="comparison-risk-label">{level.toUpperCase()}</div>
                            <div className="comparison-risk-value">{resultPayload.riskBreakdown?.[level] ?? 0}</div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="comparison-findings-card">
                      <div className="adaptive-subsection-title">Detailed report highlights</div>
                      <div className="comparison-finding-list">
                        {resultPayload.insights?.length ? (
                          resultPayload.insights.map((item, index) => (
                            <article className="comparison-finding-item" key={`${index}-${item.issue}`}>
                              <div className="comparison-finding-head">
                                <span className={`status-pill status-pill--${getRiskTone(item.risk_level)}`}>{item.risk_level}</span>
                                <span className="comparison-score-chip">Similarity {item.similarity_score}</span>
                              </div>
                              <div className="comparison-finding-clause">{item.issue}</div>
                              <p className="comparison-finding-copy">{item.reason}</p>
                              <div className="comparison-finding-meta">
                                <strong>Matched With:</strong> {item.matched_with || "No close clause match identified"}
                              </div>
                              <div className="comparison-finding-meta">
                                <strong>Recommended Action:</strong> {item.recommendation}
                              </div>
                            </article>
                          ))
                        ) : (
                          <div className="empty-state">Detailed findings will appear here after comparison completes.</div>
                        )}
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="analysis-report-layout">
                    <section className="comparison-findings-card">
                      <div className="adaptive-subsection-title">Category distribution</div>
                      <div className="category-chip-list">
                        {resultPayload.topCategories?.length ? (
                          resultPayload.topCategories.map(([category, count]) => (
                            <span className="adaptive-highlight-pill" key={category}>
                              {category}: {count}
                            </span>
                          ))
                        ) : (
                          <span className="adaptive-status-note">No category distribution is available for this contract yet.</span>
                        )}
                      </div>
                    </section>

                    <section className="comparison-findings-card">
                      <div className="adaptive-subsection-title">Clause preview</div>
                      <div className="comparison-finding-list">
                        {resultPayload.sampleOutput?.map((item, index) => (
                          <article className="comparison-finding-item" key={`${index}-${item.category}`}>
                            <div className="comparison-finding-head">
                              <span className="status-pill status-pill--info">{item.category}</span>
                            </div>
                            <div className="comparison-finding-clause">{item.text}</div>
                          </article>
                        ))}
                      </div>
                    </section>
                  </div>
                )}
              </div>
            )}
          </article>

          <article className="chat-panel chat-panel--contract">
            <div className="chat-panel-head">
              <div>
                <p className="ey-kicker">AI Copilot</p>
                <h3 className="card-title">Review conversation</h3>
                <p className="card-subtitle">
                  Use the assistant like ChatGPT for follow-up questions once the main report is on screen.
                </p>
              </div>
              <span className={`status-pill status-pill--${analysisResult ? "healthy" : "neutral"}`}>
                {analysisResult ? (
                  <>
                    <FiCheckCircle />
                    Live context ready
                  </>
                ) : (
                  <>
                    <FiMessageSquare />
                    Waiting for analysis
                  </>
                )}
              </span>
            </div>

            <div className="chat-thread" aria-live="polite" ref={threadRef}>
              {chatMessages.map((message, index) => (
                <div className={`chat-message chat-message--${message.role}`} key={`${message.role}-${index}`}>
                  <div className="chat-role">{message.role === "user" ? "You" : "Assistant"}</div>
                  <p>{message.content}</p>
                </div>
              ))}

              {isProcessing ? <div className="chat-loading">Analyzing documents and drafting the next response...</div> : null}
            </div>

            <div className="chat-actions-row">
              <div className="chat-suggestions">
                <button className="action-pill" type="button" onClick={() => handleSuggestedAction("Generate a detailed contract comparison report.")}>
                  Comparison report
                </button>
                <button className="action-pill" type="button" onClick={() => handleSuggestedAction("Summarize the top risks in this contract.")}>
                  Top risks summary
                </button>
                <button className="action-pill" type="button" onClick={() => handleSuggestedAction("Highlight the most important clauses and obligations.")}>
                  Key clauses
                </button>
                <button className="action-pill" type="button" onClick={() => handleSuggestedAction("List the obligations that should be escalated to legal review.")}>
                  Escalation view
                </button>
              </div>

              <div className="chat-input-row">
                <input
                  className="form-input"
                  value={chatQuestion}
                  onChange={(event) => setChatQuestion(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleAskQuestion();
                    }
                  }}
                  placeholder="Ask about obligations, clause intent, exceptions, or comparison findings..."
                />
                <button className="primary-button" type="button" onClick={handleAskQuestion} disabled={isProcessing || !analysisResult}>
                  {isProcessing ? "Thinking..." : "Send"}
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default ContractUpload;
