import { useState } from "react";
import axios from "axios";

function ContractUpload() {
  const [primaryContract, setPrimaryContract] = useState(null);
  const [comparisonContract, setComparisonContract] = useState(null);
  const [analysisResult, setAnalysisResult] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Upload a contract to begin. For a single contract, press Process Contract and then ask questions. For two contracts, compare them and review the result here."
    }
  ]);
  const [chatQuestion, setChatQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const resetSession = () => {
    setAnalysisResult("");
    setChatMessages([
      {
        role: "assistant",
        content:
          "Upload a contract to begin. For a single contract, press Process Contract and then ask questions. For two contracts, compare them and review the result here."
      }
    ]);
    setChatQuestion("");
  };

  const handlePrimaryChange = (event) => {
    const file = event.target.files[0] || null;
    setPrimaryContract(file);
    resetSession();
  };

  const handleComparisonChange = (event) => {
    const file = event.target.files[0] || null;
    setComparisonContract(file);
    resetSession();
  };

  const appendChatMessage = (role, content) => {
    setChatMessages((messages) => [
      ...messages,
      {
        role,
        content
      }
    ]);
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
        const summary = `Comparison complete.\nTotal Issues: ${response.data.total_issues}\nReport generated: ${response.data.report_generated}`;

        setAnalysisResult(summary);
        appendChatMessage("assistant", summary);
      } else {
        const response = await uploadContract(primaryContract);
        const summary = `Contract processed: ${response.filename}\nTotal clauses: ${response.total_clauses}\nYou can now ask questions about this contract.`;

        setAnalysisResult(summary);
        appendChatMessage("assistant", summary);
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

    if (!question) return;

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

  return (
    <section className="tool-card">
      <div className="card-header">
        <div>
          <p className="ey-kicker">Workspace</p>
          <h3 className="card-title">Contract Assistant</h3>
          <p className="card-subtitle">Upload contracts and use the chat to analyze, compare, or ask detailed questions.</p>
        </div>
      </div>

      <div className="chat-toolbar">
        <div className="upload-actions">
          <label className="upload-button">
            Upload Primary
            <input type="file" accept=".pdf" onChange={handlePrimaryChange} />
          </label>

          <label className="upload-button upload-button--secondary">
            Upload Comparison
            <input type="file" accept=".pdf" onChange={handleComparisonChange} />
          </label>
        </div>

        <div className="action-buttons">
          <button className="secondary-button" type="button" onClick={handleProcess} disabled={isProcessing || !primaryContract}>
            {comparisonContract ? "Compare Contracts" : "Generate Result"}
          </button>
          <button className="secondary-button" type="button" onClick={resetSession}>
            Reset Chat
          </button>
        </div>
      </div>

      <div className="chat-panel">
        <div className="chat-thread" aria-live="polite">
          {chatMessages.map((message, index) => (
            <div
              className={`chat-message chat-message--${message.role}`}
              key={`${message.role}-${index}`}
            >
              <div className="chat-role">{message.role === "user" ? "You" : "Assistant"}</div>
              <p>{message.content}</p>
            </div>
          ))}
        </div>

        <div className="chat-actions-row">
          <div className="chat-suggestions">
            <button className="action-pill" type="button" onClick={() => handleSuggestedAction("Generate a detailed contract comparison report.")}>Generate comparison report</button>
            <button className="action-pill" type="button" onClick={() => handleSuggestedAction("Summarize the top risks in this contract.")}>Top risks summary</button>
            <button className="action-pill" type="button" onClick={() => handleSuggestedAction("Highlight the most important clauses and obligations.")}>Highlight key clauses</button>
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
              placeholder="Ask about this contract or comparison result..."
            />
            <button
              className="primary-button"
              type="button"
              onClick={handleAskQuestion}
              disabled={isProcessing || !analysisResult}
            >
              {isProcessing ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContractUpload;
