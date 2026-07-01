import { startTransition, useState } from "react";
import axios from "axios";
import {
  FiActivity,
  FiArrowRight,
  FiBriefcase,
  FiDownload,
  FiFileText,
  FiRefreshCw,
  FiUploadCloud,
  FiZap
} from "react-icons/fi";

import AgentStatusPanel from "./AgentStatusPanel";
import RiskIntelligencePanel from "./RiskIntelligencePanel";
import ExplainabilityPanel from "./ExplainabilityPanel";
import GovernanceCompliancePanel from "./GovernanceCompliancePanel";
import ExecutiveSummaryPanel from "./ExecutiveSummaryPanel";
import TopRisksTable from "./TopRisksTable";
import {
  downloadPdfDocument,
  sanitizeFilename
} from "../utils/downloads";

const INITIAL_QUERY =
  "Run an adaptive contract intelligence review and summarize the major risks, governance impact, and escalation needs.";

function countActiveFeatures(features) {
  if (!features) {
    return 0;
  }

  return Object.entries(features).filter(([key, value]) => key !== "payment_days" && Number(value) === 1).length;
}

function getRiskTone(riskClass) {
  const normalized = String(riskClass || "").toLowerCase();

  if (normalized === "critical" || normalized === "high") {
    return "high";
  }

  if (normalized === "medium") {
    return "medium";
  }

  return "healthy";
}

function AdaptiveWorkflowPage() {
  const [query, setQuery] = useState(INITIAL_QUERY);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workflowResult, setWorkflowResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileVersion, setFileVersion] = useState(0);

  const workflowOutput = workflowResult?.workflow_output || {};
  const selectedAgents = workflowResult?.selected_agents || [];
  const agentState = workflowOutput.agent_state || {};
  const contractFeatures = workflowOutput.contract_features || {};
  const mlRiskPrediction = workflowOutput.ml_risk_prediction || {};
  const explainability = workflowOutput.explainability || {};
  const riskMetrics = workflowOutput.risk_metrics || {};
  const governance = workflowOutput.governance || {};
  const compliance = workflowOutput.compliance || {};
  const risks = Array.isArray(workflowOutput.risks) ? workflowOutput.risks : [];
  const executiveSummary = workflowOutput.executive_summary?.executive_summary || "";
  const activeFeatureCount = countActiveFeatures(contractFeatures);
  const clauseCount = Array.isArray(workflowOutput.clauses) ? workflowOutput.clauses.length : 0;
  const riskTone = getRiskTone(mlRiskPrediction.risk_class);

  const handleDownloadWorkflowPdf = () => {
    if (!workflowResult) {
      return;
    }

    const sections = [
      {
        heading: "Agent State",
        bullets: [
          `Workflow Type: ${agentState.workflow_type || "Contract Intelligence"}`,
          `Selected Agents: ${selectedAgents.join(", ") || "None"}`,
          `Clauses Ingested: ${clauseCount}`,
          `Risk Count: ${risks.length}`
        ]
      },
      {
        heading: "ML Risk Prediction",
        bullets: [
          `Risk Class: ${mlRiskPrediction.risk_class || "N/A"}`,
          `Risk Score: ${mlRiskPrediction.risk_score || 0}`,
          `Escalation Probability: ${mlRiskPrediction.escalation_probability || 0}`
        ]
      },
      {
        heading: "Risk Metrics",
        bullets: [
          `Rules Risk Score: ${riskMetrics.risk_score || 0}`,
          `Contract Health: ${riskMetrics.contract_health || 0}`,
          `Governance Score: ${governance.governance_score || 0}`
        ]
      },
      {
        heading: "Governance and Compliance",
        bullets: [
          `Review Level: ${governance.review_level || "N/A"}`,
          `Escalation Required: ${governance.escalation_required ? "Yes" : "No"}`,
          `GDPR Detected: ${compliance.gdpr ? "Yes" : "No"}`,
          `HIPAA Detected: ${compliance.hipaa ? "Yes" : "No"}`,
          `SOX Detected: ${compliance.sox ? "Yes" : "No"}`
        ]
      },
      {
        heading: "Top Explainability Factors",
        bullets: (explainability.top_factors || [])
          .slice(0, 8)
          .map((factor) => `${factor.feature}: impact ${factor.impact}, value ${factor.value}`)
      },
      {
        heading: "Top Risks",
        bullets: risks.slice(0, 8).map((risk) => `${risk.risk_level} | ${risk.severity}: ${risk.clause}`)
      },
      {
        heading: "Executive Summary",
        body: executiveSummary || "No executive summary was returned."
      }
    ];

    downloadPdfDocument({
      filename: `${sanitizeFilename(file?.name || "adaptive_workflow_report")}.pdf`,
      title: "Adaptive Workflow Report",
      sections
    });
  };

  const resetWorkflow = () => {
    setWorkflowResult(null);
    setErrorMessage("");
    setFile(null);
    setFileVersion((value) => value + 1);
    setQuery(INITIAL_QUERY);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setErrorMessage("Upload a contract PDF to run the adaptive workflow.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("query", query);
      formData.append("file", file);

      const response = await axios.post("http://localhost:8000/adaptive-workflow", formData);
      startTransition(() => {
        setWorkflowResult(response.data);
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("The adaptive workflow could not be completed. Confirm the backend services and local models are available.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="adaptive-page">
      <div className="adaptive-hero-grid">
        <article className="adaptive-command-card">
          <div className="adaptive-command-header">
            <span className="ey-kicker">Adaptive Workflow</span>
            <div className="adaptive-badge-row">
              <span className="adaptive-badge">Agent orchestration</span>
              <span className="adaptive-badge">ML risk prediction</span>
              <span className="adaptive-badge">Explainable AI</span>
            </div>
          </div>

          <h2 className="adaptive-command-title">Enterprise contract intelligence with a manager-ready presentation layer.</h2>
          <p className="adaptive-command-copy">
            Trigger the adaptive backend workflow, then review agent state, contract features, risk predictions, explainability, governance signals, and the executive readout in one polished dashboard.
          </p>

          <div className="adaptive-summary-grid">
            <div className="adaptive-summary-card">
              <span className="adaptive-summary-label">Selected Agents</span>
              <strong className="adaptive-summary-value">{selectedAgents.length}</strong>
              <span className="adaptive-summary-note">orchestrated in the most recent run</span>
            </div>
            <div className="adaptive-summary-card">
              <span className="adaptive-summary-label">Clauses Ingested</span>
              <strong className="adaptive-summary-value">{clauseCount}</strong>
              <span className="adaptive-summary-note">parsed from the uploaded contract</span>
            </div>
            <div className="adaptive-summary-card">
              <span className="adaptive-summary-label">Risk Class</span>
              <strong className={`adaptive-summary-value adaptive-summary-value--${riskTone}`}>
                {mlRiskPrediction.risk_class || "Waiting"}
              </strong>
              <span className="adaptive-summary-note">machine learning portfolio signal</span>
            </div>
            <div className="adaptive-summary-card">
              <span className="adaptive-summary-label">Active Features</span>
              <strong className="adaptive-summary-value">{activeFeatureCount}</strong>
              <span className="adaptive-summary-note">contract indicators triggered</span>
            </div>
          </div>
        </article>

        <article className="section-card adaptive-intake-card">
          <div className="card-header">
            <div>
              <p className="ey-kicker">Run Analysis</p>
              <h3 className="card-title">Adaptive Workflow Intake</h3>
              <p className="card-subtitle">
                Upload a contract, refine the workflow prompt, and launch the manager demo view for the latest orchestration result.
              </p>
            </div>
          </div>

          <form className="adaptive-form" onSubmit={handleSubmit}>
            <label className="form-label">
              Workflow Prompt
              <textarea
                className="form-textarea adaptive-query-textarea"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Describe the analysis focus for the adaptive workflow..."
              />
            </label>

            <div className={`adaptive-file-card ${file ? "is-ready" : ""}`}>
              <div className="adaptive-file-meta">
                <div className="adaptive-file-icon">
                  <FiFileText />
                </div>
                <div>
                  <div className="adaptive-file-label">Contract Document</div>
                  <div className="adaptive-file-name">{file ? file.name : "No contract selected yet"}</div>
                </div>
              </div>

              <label className="upload-button">
                <FiUploadCloud />
                Upload PDF
                <input key={`adaptive-file-${fileVersion}`} type="file" accept=".pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} />
              </label>
            </div>

            {errorMessage ? <div className="form-error">{errorMessage}</div> : null}

            <div className="adaptive-form-actions">
              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Running Workflow..." : "Run Adaptive Workflow"}
                <FiArrowRight />
              </button>
              <button className="secondary-button" type="button" onClick={resetWorkflow}>
                <FiRefreshCw />
                Reset
              </button>
            </div>
          </form>

          <div className="adaptive-intake-notes">
            <div className="adaptive-note-item">
              <FiZap />
              Agent routing, explainability, governance, and compliance are all rendered automatically from `workflow_output`.
            </div>
            <div className="adaptive-note-item">
              <FiBriefcase />
              Designed for enterprise demos where technical depth must still look boardroom-ready.
            </div>
            <button className="secondary-button adaptive-download-button" type="button" onClick={handleDownloadWorkflowPdf} disabled={!workflowResult}>
              <FiDownload />
              Download PDF
            </button>
          </div>
        </article>
      </div>

      {!workflowResult ? (
        <section className="section-card adaptive-empty-state-card">
          <div className="adaptive-empty-state">
            <FiActivity />
            <div>
              <h3 className="card-title">No adaptive run loaded yet</h3>
              <p className="card-subtitle">
                Run the workflow to populate agent state, risk intelligence, explainability, governance, compliance, top risks, and the executive summary report.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <div className="adaptive-results-stack">
          <div className="adaptive-results-grid">
            <AgentStatusPanel
              agentState={agentState}
              selectedAgents={selectedAgents}
              clauseCount={clauseCount}
              riskCount={risks.length}
            />
            <GovernanceCompliancePanel governance={governance} compliance={compliance} />
          </div>

          <div className="adaptive-results-grid adaptive-results-grid--wide">
            <RiskIntelligencePanel
              contractFeatures={contractFeatures}
              mlRiskPrediction={mlRiskPrediction}
              riskMetrics={riskMetrics}
              modelConsensus={workflowOutput.model_consensus}
            />
            <ExplainabilityPanel topFactors={explainability.top_factors || []} />
          </div>

          <TopRisksTable risks={risks} />
          <ExecutiveSummaryPanel summary={executiveSummary} />
        </div>
      )}
    </section>
  );
}

export default AdaptiveWorkflowPage;
