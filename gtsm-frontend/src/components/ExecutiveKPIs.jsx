import { FiAlertTriangle, FiCpu, FiFileText, FiShield } from "react-icons/fi";

const INITIAL_METRICS = {
  contracts: 0,
  total_risks: 0,
  high_risk_contracts: 0,
  agent_runs: 0
};

function ExecutiveKPIs({ metrics = INITIAL_METRICS }) {
  const cards = [
    {
      title: "Contracts",
      value: metrics.contracts ?? 0,
      note: "portfolio records under review",
      icon: <FiFileText />,
      tone: "standard"
    },
    {
      title: "Total Risks",
      value: metrics.total_risks ?? 0,
      note: "issues identified across the portfolio",
      icon: <FiAlertTriangle />,
      tone: "alert"
    },
    {
      title: "High Risk",
      value: metrics.high_risk_contracts ?? 0,
      note: "contracts requiring senior attention",
      icon: <FiShield />,
      tone: "emphasis"
    },
    {
      title: "Agent Runs",
      value: metrics.agent_runs ?? 0,
      note: "workflow executions logged",
      icon: <FiCpu />,
      tone: "standard"
    }
  ];

  return (
    <section className="metric-grid" aria-label="Executive KPIs">
      {cards.map((card) => (
        <article className={`metric-card metric-card--${card.tone}`} key={card.title}>
          <div>
            <div className="metric-card-header">
              <p className="metric-label">{card.title}</p>
              <div className="metric-icon">{card.icon}</div>
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
