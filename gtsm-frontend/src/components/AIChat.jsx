import { useState } from "react";
import axios from "axios";
import { FiSend } from "react-icons/fi";

function AIChat() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const askQuestion = async () => {
    if (!question) return;

    try {
      const result = await axios.post("http://localhost:8000/chat", {
        query: question
      });

      setResponse(result.data.response);
    } catch (error) {
      console.error(error);
      setResponse("Error contacting AI service");
    }
  };

  return (
    <section className="tool-card">
      <div className="card-header">
        <div>
          <p className="ey-kicker">AI Assistant</p>
          <h2 className="page-heading">AI Contract Assistant</h2>
          <p className="page-subtitle">Ask contract questions through the existing AI service.</p>
        </div>
      </div>

      <label className="form-label">
        Question
        <textarea
          className="form-textarea"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask contract questions..."
        />
      </label>

      <div className="tool-actions">
        <button className="primary-button" type="button" onClick={askQuestion}>
          <FiSend />
          Ask AI
        </button>
      </div>

      <label className="form-label">
        Response
        <textarea
          className="result-output"
          value={response}
          readOnly
          placeholder="The assistant response will appear here."
        />
      </label>
    </section>
  );
}

export default AIChat;
