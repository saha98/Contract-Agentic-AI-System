import { useEffect, useState } from "react";
import axios from "axios";
import { FiActivity, FiAlertTriangle, FiCpu, FiLayers } from "react-icons/fi";

function ExecutiveAnalyticsRow() {
  const [metrics, setMetrics] = useState({
    contracts: 0,
    total_risks: 0,
    avg_clauses: 0,
    high_risk_contracts: 0,
    agent_runs: 0
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/executive-metrics")
      .then((response) => {
        setMetrics(response.data);
      })
      .catch((error) => {
        console.error("Executive Metrics Error:", error);
      });
  }, []);

  const cards = [
    {
      title: "Total Contracts",
      value: metrics.contracts,
      subtitle: "Contracts processed",
      icon: <FiActivity />
    },
    {
      title: "Risk Volume",
      value: metrics.total_risks,
      subtitle: "Risks identified",
      icon: <FiAlertTriangle />
    },
    {
      title: "Average Clauses",
      value: metrics.avg_clauses,
      subtitle: "Per contract",
      icon: <FiLayers />
    },
    {
      title: "Agent Executions",
      value: metrics.agent_runs,
      subtitle: "Workflow runs",
      icon: <FiCpu />
    }
  ];

  return (
    <section className="metric-grid" aria-label="Executive analytics">
      {cards.map((card) => (
        <article className="metric-card analytics-card" key={card.title}>
          <div>
            <div className="metric-card-header">
              <p className="metric-label">{card.title}</p>
              <div className="metric-icon">{card.icon}</div>
            </div>
            <div className="metric-value">{card.value}</div>
          </div>
          <p className="metric-note">{card.subtitle}</p>
        </article>
      ))}
    </section>
  );
}

export default ExecutiveAnalyticsRow;
