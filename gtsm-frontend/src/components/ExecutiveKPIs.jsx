import { useEffect, useState } from "react";
import axios from "axios";
import { FiAlertTriangle, FiCpu, FiFileText, FiShield } from "react-icons/fi";

function ExecutiveKPIs() {
  const [metrics, setMetrics] = useState({
    contracts: 0,
    total_risks: 0,
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
        console.error("Executive Metrics API Error:", error);
      });
  }, []);

  const cards = [
    {
      title: "Contracts",
      value: metrics.contracts,
      note: "Total processed",
      icon: <FiFileText />
    },
    {
      title: "Total Risks",
      value: metrics.total_risks,
      note: "Identified issues",
      icon: <FiAlertTriangle />
    },
    {
      title: "High Risk",
      value: metrics.high_risk_contracts,
      note: "Contracts requiring attention",
      icon: <FiShield />
    },
    {
      title: "Agent Runs",
      value: metrics.agent_runs,
      note: "Workflow executions",
      icon: <FiCpu />
    }
  ];

  return (
    <section className="metric-grid" aria-label="Executive KPIs">
      {cards.map((card) => (
        <article className="metric-card" key={card.title}>
          <div>
            <div className="metric-card-header">
              <p className="metric-label">{card.title}</p>
              <div className="metric-icon accent">{card.icon}</div>
            </div>
            <div className="metric-value">{card.value}</div>
          </div>
          <p className="metric-note">{card.note}</p>
        </article>
      ))}
    </section>
  );
}

export default ExecutiveKPIs;
