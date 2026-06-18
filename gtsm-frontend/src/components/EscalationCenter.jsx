import { useEffect, useState } from "react";
import axios from "axios";

function EscalationCenter() {
  const [summary, setSummary] = useState({});
  const [escalations, setEscalations] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/escalation-dashboard")
      .then((response) => {
        setSummary(response.data.summary || {});
        setEscalations(response.data.escalations || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const summaryCards = [
    {
      title: "High Risk Clauses",
      value: summary.high_risk || 0,
      level: "high"
    },
    {
      title: "Medium Risk Clauses",
      value: summary.medium_risk || 0,
      level: "medium"
    },
    {
      title: "Low Risk Clauses",
      value: summary.low_risk || 0,
      level: "low"
    }
  ];

  const getPriorityLevel = (priority = "") => {
    const normalized = priority.toLowerCase();
    if (normalized.includes("high")) return "high";
    if (normalized.includes("medium")) return "medium";
    if (normalized.includes("low")) return "low";
    return "neutral";
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="ey-kicker">Escalations</p>
          <h2 className="page-heading">Escalation Center</h2>
          <p className="page-subtitle">Priority risk routing and escalated contract clauses.</p>
        </div>
      </header>

      <section className="metric-grid" aria-label="Risk summary">
        {summaryCards.map((card) => (
          <article className="metric-card" key={card.title}>
            <div>
              <p className="metric-label">{card.title}</p>
              <div className="metric-value">{card.value}</div>
            </div>
            <p className="metric-note">
              <span className={`status-pill status-pill--${card.level}`}>{card.level}</span>
            </p>
          </article>
        ))}
      </section>

      <section className="table-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Escalated Items</h3>
            <p className="card-subtitle">Clauses routed for review.</p>
          </div>
        </div>

        {escalations.length === 0 ? (
          <div className="empty-state">No escalated items are available yet.</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Clause</th>
                  <th>Department</th>
                  <th>Priority</th>
                </tr>
              </thead>

              <tbody>
                {escalations.map((item, index) => (
                  <tr key={`${item.clause}-${index}`}>
                    <td>{item.clause}</td>
                    <td>{item.department}</td>
                    <td>
                      <span className={`status-pill status-pill--${getPriorityLevel(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default EscalationCenter;
