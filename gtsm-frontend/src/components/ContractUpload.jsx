import { useState } from "react";
import axios from "axios";
import {
  FiDatabase,
  FiFileText,
  FiMessageSquare,
  FiRefreshCw,
  FiSend,
  FiUploadCloud
} from "react-icons/fi";

function ContractUpload() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [result, setResult] = useState("");
  const [sheetFile, setSheetFile] = useState(null);
  const [sheetText, setSheetText] = useState("");
  const [sheetSummary, setSheetSummary] = useState(null);
  const [sheetQuestion, setSheetQuestion] = useState("");
  const [sheetMessages, setSheetMessages] = useState([]);
  const [isChatting, setIsChatting] = useState(false);
  const [sheetError, setSheetError] = useState("");

  const handleCompare = async () => {
    if (!file1 || !file2) {
      alert("Please upload both files");
      return;
    }

    const formData = new FormData();

    formData.append("file1", file1);
    formData.append("file2", file2);

    try {
      const response = await axios.post("http://localhost:8000/compare", formData);

      setResult(
        `Total Issues: ${response.data.total_issues}
Email Status: ${response.data.email_status}
Report: ${response.data.report_generated}`
      );
    } catch (error) {
      console.error(error);
      alert("Error comparing contracts");
    }
  };

  const detectDelimiter = (text) => {
    const firstLine = text.split(/\r?\n/).find((line) => line.trim()) || "";

    if (firstLine.includes("\t")) return "\t";
    if (firstLine.includes(";")) return ";";

    return ",";
  };

  const summarizeSheet = (text, filename) => {
    const delimiter = detectDelimiter(text);
    const rows = text
      .split(/\r?\n/)
      .map((row) => row.trim())
      .filter(Boolean)
      .map((row) => row.split(delimiter).map((cell) => cell.trim()));

    const headers = rows[0] || [];
    const dataRows = rows.slice(1);
    const previewRows = dataRows.slice(0, 5);

    return {
      filename,
      delimiter: delimiter === "\t" ? "Tab" : delimiter,
      headers,
      rowCount: dataRows.length,
      columnCount: headers.length,
      previewRows
    };
  };

  const handleSheetUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSheetError("");
    setSheetFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      const text = String(reader.result || "");

      if (!text.trim()) {
        setSheetText("");
        setSheetSummary(null);
        setSheetError("The selected sheet appears to be empty.");
        return;
      }

      setSheetText(text);
      setSheetSummary(summarizeSheet(text, file.name));
      setSheetMessages([
        {
          role: "assistant",
          content: `Sheet loaded: ${file.name}. Ask a question about the uploaded data.`
        }
      ]);
    };

    reader.onerror = () => {
      setSheetText("");
      setSheetSummary(null);
      setSheetError("Unable to read this file. Please upload a CSV, TSV, or text export.");
    };

    reader.readAsText(file);
  };

  const buildSheetPrompt = (question) => {
    const trimmedSheet = sheetText.slice(0, 7000);
    const headers = sheetSummary?.headers?.join(", ") || "No headers detected";

    return `
The user uploaded a sheet named "${sheetFile?.name || "uploaded sheet"}".

Sheet Profile:
- Columns: ${headers}
- Rows: ${sheetSummary?.rowCount || 0}
- Delimiter: ${sheetSummary?.delimiter || "Unknown"}

Sheet Content Sample:
${trimmedSheet}

Question:
${question}

Answer based only on the uploaded sheet content. If the sheet sample does not contain enough information, say what is missing and what the user should upload or ask next.
`;
  };

  const handleSheetQuestion = async () => {
    const question = sheetQuestion.trim();

    if (!sheetText) {
      alert("Please upload a sheet first");
      return;
    }

    if (!question) return;

    const userMessage = {
      role: "user",
      content: question
    };

    setSheetMessages((messages) => [...messages, userMessage]);
    setSheetQuestion("");
    setIsChatting(true);

    try {
      const response = await axios.post("http://localhost:8000/chat", {
        query: buildSheetPrompt(question)
      });

      setSheetMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content: response.data.response
        }
      ]);
    } catch (error) {
      console.error(error);
      setSheetMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content: "I could not reach the AI service. Please confirm the backend and local LLM are running."
        }
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="ey-kicker">Contract Operations</p>
          <h2 className="page-heading">Contract Comparison</h2>
          <p className="page-subtitle">Compare company and vendor documents through the existing AI workflow.</p>
        </div>
      </header>

      <section className="tool-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Document Intake</h3>
            <p className="card-subtitle">Upload both source files before running comparison.</p>
          </div>
          <FiUploadCloud size={24} />
        </div>

        <div className="upload-grid">
          <label className="file-card">
            <span className="file-card-header">
              <FiFileText />
              Company Contract
            </span>
            <input
              className="file-input"
              type="file"
              onChange={(e) => setFile1(e.target.files[0])}
            />
          </label>

          <label className="file-card">
            <span className="file-card-header">
              <FiFileText />
              Vendor Contract
            </span>
            <input
              className="file-input"
              type="file"
              onChange={(e) => setFile2(e.target.files[0])}
            />
          </label>
        </div>

        <div className="tool-actions">
          <button className="primary-button" type="button" onClick={handleCompare}>
            <FiRefreshCw />
            Compare Contracts
          </button>
        </div>
      </section>

      <section className="tool-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Comparison Result</h3>
            <p className="card-subtitle">Generated output from the comparison workflow.</p>
          </div>
        </div>

        <textarea
          className="result-output"
          value={result}
          readOnly
          placeholder="Run a comparison to see the result here."
        />
      </section>

      <section className="tool-card">
        <div className="card-header">
          <div>
            <p className="ey-kicker">Interactive Sheet Q&A</p>
            <h3 className="card-title">Contract Sheet Assistant</h3>
            <p className="card-subtitle">
              Upload a CSV, TSV, or text sheet export and ask questions about the data.
            </p>
          </div>
          <FiMessageSquare size={24} />
        </div>

        <div className="sheet-chat-grid">
          <div className="sheet-intake-panel">
            <label className="file-card">
              <span className="file-card-header">
                <FiDatabase />
                Upload Sheet
              </span>
              <input
                className="file-input"
                type="file"
                accept=".csv,.tsv,.txt"
                onChange={handleSheetUpload}
              />
            </label>

            {sheetError && <div className="form-error">{sheetError}</div>}

            {sheetSummary && (
              <div className="sheet-summary">
                <div className="sheet-summary-row">
                  <span>File</span>
                  <strong>{sheetSummary.filename}</strong>
                </div>
                <div className="sheet-summary-row">
                  <span>Rows</span>
                  <strong>{sheetSummary.rowCount}</strong>
                </div>
                <div className="sheet-summary-row">
                  <span>Columns</span>
                  <strong>{sheetSummary.columnCount}</strong>
                </div>
                <div className="sheet-summary-row">
                  <span>Delimiter</span>
                  <strong>{sheetSummary.delimiter}</strong>
                </div>
              </div>
            )}

            {sheetSummary?.headers?.length > 0 && (
              <div className="sheet-columns">
                <p className="metric-label">Detected Columns</p>
                <div className="column-chip-list">
                  {sheetSummary.headers.slice(0, 10).map((header, index) => (
                    <span className="status-pill status-pill--neutral" key={`${header}-${index}`}>
                      {header || `Column ${index + 1}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="chat-panel">
            <div className="chat-thread" aria-live="polite">
              {sheetMessages.length === 0 ? (
                <div className="empty-state">Upload a sheet to start an interactive Q&A session.</div>
              ) : (
                sheetMessages.map((message, index) => (
                  <div
                    className={`chat-message chat-message--${message.role}`}
                    key={`${message.role}-${index}`}
                  >
                    <div className="chat-role">
                      {message.role === "user" ? "You" : "Assistant"}
                    </div>
                    <p>{message.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="chat-input-row">
              <input
                className="form-input"
                value={sheetQuestion}
                onChange={(event) => setSheetQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSheetQuestion();
                  }
                }}
                placeholder="Ask about totals, risks, clauses, vendors, dates..."
              />
              <button
                className="primary-button"
                type="button"
                onClick={handleSheetQuestion}
                disabled={isChatting || !sheetText}
              >
                <FiSend />
                {isChatting ? "Asking..." : "Ask"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContractUpload;
