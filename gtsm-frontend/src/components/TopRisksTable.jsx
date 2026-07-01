function getRiskWeight(level) {
  const map = {
    high: 3,
    medium: 2,
    low: 1
  };

  return map[String(level || "").toLowerCase()] || 0;
}

function getSeverityWeight(level) {
  const map = {
    critical: 3,
    moderate: 2,
    minor: 1
  };

  return map[String(level || "").toLowerCase()] || 0;
}

function truncate(value, maxLength) {
  const text = String(value || "").trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3)}...`;
}

function TopRisksTable({ risks = [] }) {
  const sortedRisks = risks
    .slice()
    .sort((left, right) => {
      const riskDiff = getRiskWeight(right.risk_level) - getRiskWeight(left.risk_level);

      if (riskDiff !== 0) {
        return riskDiff;
      }

      return getSeverityWeight(right.severity) - getSeverityWeight(left.severity);
    })
    .slice(0, 8);

  return (
    <section className="table-card adaptive-panel">
      <div className="card-header">
        <div>
          <p className="ey-kicker">Top Risks</p>
          <h3 className="card-title">Priority clauses for reviewer attention</h3>
          <p className="card-subtitle">The highest-ranked contract risks are summarized below with business impact and recommended action.</p>
        </div>
      </div>

      {sortedRisks.length === 0 ? (
        <div className="empty-state">No risks were returned for the latest workflow run.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table adaptive-data-table">
            <thead>
              <tr>
                <th>Clause</th>
                <th>Risk Level</th>
                <th>Severity</th>
                <th>Business Impact</th>
                <th>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedRisks.map((risk, index) => (
                <tr className={`data-row data-row--${String(risk.risk_level || "").toLowerCase()}`} key={`${index}-${risk.clause}`}>
                  <td>
                    <div className="adaptive-clause-cell">{truncate(risk.clause, 180)}</div>
                  </td>
                  <td>
                    <span className={`status-pill status-pill--${String(risk.risk_level || "").toLowerCase()}`}>
                      {risk.risk_level || "Unknown"}
                    </span>
                  </td>
                  <td>{risk.severity || "N/A"}</td>
                  <td>{truncate(risk.business_impact, 160)}</td>
                  <td>{truncate(risk.recommended_action, 160)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default TopRisksTable;
