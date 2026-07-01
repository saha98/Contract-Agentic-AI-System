import {
  FiActivity,
  FiCheckCircle,
  FiCpu,
  FiLayers,
  FiShield,
  FiXCircle
} from "react-icons/fi";

function formatLabel(value) {
  return String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function AgentStatusPanel({ agentState = {}, selectedAgents = [], clauseCount = 0, riskCount = 0 }) {
  const stateCards = [
    {
      label: "Workflow Type",
      value: agentState.workflow_type || "Contract Intelligence",
      tone: "info",
      icon: <FiLayers />
    },
    {
      label: "RAG Layer",
      value: agentState.rag_enabled ? "Enabled" : "Disabled",
      tone: agentState.rag_enabled ? "healthy" : "muted",
      icon: agentState.rag_enabled ? <FiCheckCircle /> : <FiXCircle />
    },
    {
      label: "ML Layer",
      value: agentState.ml_enabled ? "Enabled" : "Disabled",
      tone: agentState.ml_enabled ? "healthy" : "muted",
      icon: agentState.ml_enabled ? <FiCpu /> : <FiXCircle />
    },
    {
      label: "Explainability",
      value: agentState.xai_enabled ? "Enabled" : "Disabled",
      tone: agentState.xai_enabled ? "healthy" : "muted",
      icon: agentState.xai_enabled ? <FiActivity /> : <FiXCircle />
    },
    {
      label: "Governance",
      value: agentState.governance_enabled ? "Enabled" : "Disabled",
      tone: agentState.governance_enabled ? "healthy" : "muted",
      icon: agentState.governance_enabled ? <FiShield /> : <FiXCircle />
    }
  ];

  return (
    <section className="section-card adaptive-panel">
      <div className="card-header">
        <div>
          <p className="ey-kicker">Agent State</p>
          <h3 className="card-title">Workflow control plane</h3>
          <p className="card-subtitle">System toggles, selected agents, and the scope of the latest adaptive run.</p>
        </div>
      </div>

      <div className="adaptive-metric-strip">
        <div className="adaptive-metric-tile">
          <span className="adaptive-metric-label">Selected Agents</span>
          <strong className="adaptive-metric-value">{selectedAgents.length}</strong>
        </div>
        <div className="adaptive-metric-tile">
          <span className="adaptive-metric-label">Clauses</span>
          <strong className="adaptive-metric-value">{clauseCount}</strong>
        </div>
        <div className="adaptive-metric-tile">
          <span className="adaptive-metric-label">Risks</span>
          <strong className="adaptive-metric-value">{riskCount}</strong>
        </div>
      </div>

      <div className="adaptive-state-grid">
        {stateCards.map((card) => (
          <article className={`adaptive-state-card adaptive-state-card--${card.tone}`} key={card.label}>
            <div className="adaptive-state-icon">{card.icon}</div>
            <div className="adaptive-state-label">{card.label}</div>
            <div className="adaptive-state-value">{card.value}</div>
          </article>
        ))}
      </div>

      <div className="adaptive-agent-badges">
        {selectedAgents.length === 0 ? (
          <span className="adaptive-status-note">No agents were reported for the last run.</span>
        ) : (
          selectedAgents.map((agent) => (
            <span className="adaptive-agent-badge" key={agent}>
              {formatLabel(agent)}
            </span>
          ))
        )}
      </div>
    </section>
  );
}

export default AgentStatusPanel;
