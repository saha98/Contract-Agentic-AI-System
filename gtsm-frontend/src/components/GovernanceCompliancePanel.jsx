import { FiAlertTriangle, FiCheckCircle, FiShield } from "react-icons/fi";

function GovernanceCompliancePanel({ governance = {}, compliance = {} }) {
  const complianceRows = [
    {
      key: "gdpr",
      label: "GDPR"
    },
    {
      key: "hipaa",
      label: "HIPAA"
    },
    {
      key: "sox",
      label: "SOX"
    }
  ];

  const governanceScore = Number(governance.governance_score || 0);

  return (
    <section className="section-card adaptive-panel adaptive-panel--dark">
      <div className="card-header">
        <div>
          <p className="ey-kicker">Governance & Compliance</p>
          <h3 className="card-title">Decision controls and regulatory signals</h3>
          <p className="card-subtitle">
            Governance guidance and compliance references are shown here without exposing raw payload data.
          </p>
        </div>
      </div>

      <div className="adaptive-governance-grid">
        <article className="adaptive-governance-card">
          <div className="adaptive-governance-score">{governanceScore}</div>
          <div>
            <div className="adaptive-subsection-title">Governance score</div>
            <p className="adaptive-governance-copy">
              Higher scores indicate stronger operational posture after risk weighting. Review level and escalation are surfaced beside the score.
            </p>
          </div>
        </article>

        <div className="adaptive-governance-meta">
          <div className="adaptive-governance-item">
            <FiShield />
            <div>
              <div className="adaptive-governance-label">Review Level</div>
              <div className="adaptive-governance-value">{governance.review_level || "Not available"}</div>
            </div>
          </div>
          <div className="adaptive-governance-item">
            {governance.escalation_required ? <FiAlertTriangle /> : <FiCheckCircle />}
            <div>
              <div className="adaptive-governance-label">Escalation</div>
              <div className="adaptive-governance-value">
                {governance.escalation_required ? "Executive escalation required" : "Standard governance route"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="adaptive-compliance-grid">
        {complianceRows.map((item) => {
          const enabled = Boolean(compliance[item.key]);

          return (
            <article className={`adaptive-compliance-card ${enabled ? "is-detected" : ""}`} key={item.key}>
              <div className="adaptive-compliance-label">{item.label}</div>
              <div className="adaptive-compliance-value">{enabled ? "Reference detected" : "Not detected"}</div>
              <div className="adaptive-compliance-note">
                Keyword-based signal from processed clauses, intended for reviewer orientation rather than final legal certification.
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default GovernanceCompliancePanel;
