import { useEffect, useState } from "react";
import axios from "axios";

function AgentAnalytics() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/analytics")
      .then((response) => {
        setMetrics(response.data.agent_metrics || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <section className="table-card">
      <div className="card-header">
        <div>
          <p className="ey-kicker">Agent Intelligence</p>
          <h2 className="page-heading">Agent Performance Analytics</h2>
          <p className="page-subtitle">Runtime and execution metrics across the contract workflow.</p>
        </div>
      </div>

      {metrics.length === 0 ? (
        <div className="empty-state">No agent performance metrics are available yet.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th className="table-center">Runs</th>
                <th className="table-center">Average Runtime (s)</th>
              </tr>
            </thead>

            <tbody>
              {metrics.map((item, index) => (
                <tr key={`${item.agent}-${index}`}>
                  <td>
                    <strong className="entity-title">{item.agent}</strong>
                  </td>
                  <td className="table-center">{item.runs}</td>
                  <td className="table-center">{item.avg_runtime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AgentAnalytics;
