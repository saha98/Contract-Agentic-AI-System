import { useEffect, useState } from "react";
import axios from "axios";

function AgentMonitor() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/workflow-logs")
      .then((response) => {
        setAgents(response.data.logs || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <section className="table-card">
      <div className="card-header">
        <div>
          <p className="ey-kicker">Live Operations</p>
          <h2 className="page-heading">Live Agent Monitor</h2>
          <p className="page-subtitle">Current workflow activity from the agent execution log.</p>
        </div>
      </div>

      {agents.length === 0 ? (
        <div className="empty-state">No live agent activity is available yet.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Status</th>
                <th className="table-center">Execution Time</th>
              </tr>
            </thead>

            <tbody>
              {agents.map((agent, index) => (
                <tr key={`${agent.name || agent.agent}-${index}`}>
                  <td>
                    <strong className="entity-title">{agent.name || agent.agent}</strong>
                  </td>
                  <td>
                    <span className="status-pill status-pill--neutral">{agent.status}</span>
                  </td>
                  <td className="table-center">{agent.execution_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AgentMonitor;
