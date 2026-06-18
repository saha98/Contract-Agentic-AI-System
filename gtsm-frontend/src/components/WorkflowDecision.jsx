import { useEffect, useState } from "react";
import axios from "axios";
import { FiCheckCircle, FiMinusCircle } from "react-icons/fi";

function WorkflowDecision() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/workflow-logs").then((res) => {
      const uniqueAgents = [...new Set((res.data.logs || []).map((item) => item.agent))];
      setAgents(uniqueAgents);
    });
  }, []);

  const allAgents = [
    "Ingestion Agent",
    "Clause Agent",
    "Risk Agent",
    "Insight Agent",
    "Communication Agent",
    "Memory Agent"
  ];

  const skippedAgents = allAgents.filter((agent) => !agents.includes(agent));

  return (
    <section className="tool-card">
      <div className="card-header">
        <div>
          <p className="ey-kicker">Workflow Intelligence</p>
          <h2 className="page-heading">Adaptive Workflow Decision</h2>
          <p className="page-subtitle">Agent routing decisions from the latest workflow logs.</p>
        </div>
      </div>

      <div className="workflow-grid">
        <div>
          <h3 className="card-title">Selected Agents</h3>
          <ul className="agent-list" aria-label="Selected agents">
            {agents.length === 0 ? (
              <li>
                <FiMinusCircle className="skipped" />
                No agents selected yet
              </li>
            ) : (
              agents.map((agent) => (
                <li key={agent}>
                  <FiCheckCircle className="included" />
                  {agent}
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <h3 className="card-title">Skipped Agents</h3>
          <ul className="agent-list" aria-label="Skipped agents">
            {skippedAgents.map((agent) => (
              <li key={agent}>
                <FiMinusCircle className="skipped" />
                {agent}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default WorkflowDecision;
