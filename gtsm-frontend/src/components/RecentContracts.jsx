import { FiFileText } from "react-icons/fi";

function RecentContracts({ history = [] }) {
  const getStatus = (riskCount) => {
    if (riskCount >= 5) {
      return {
        label: "High",
        level: "high"
      };
    }

    if (riskCount >= 2) {
      return {
        label: "Medium",
        level: "medium"
      };
    }

    return {
      label: "Low",
      level: "low"
    };
  };

  const recentHistory = history.slice().reverse().slice(0, 5);

  return (
    <section className="table-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Recent Contracts</h3>
          <p className="card-subtitle">Last 5 contracts</p>
        </div>
      </div>

      {recentHistory.length === 0 ? (
        <div className="empty-state">No contracts have been processed yet.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Contract</th>
                <th className="table-center">Clauses</th>
                <th className="table-center">Risks</th>
                <th className="table-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentHistory.map((item, index) => {
                const status = getStatus(Number(item.risks || 0));

                return (
                  <tr key={`${item.contract}-${index}`}>
                    <td>
                      <div className="entity-cell">
                        <span className="entity-icon">
                          <FiFileText />
                        </span>
                        <div>
                          <div className="entity-title">{item.contract}</div>
                          <div className="entity-subtitle">Uploaded contract</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-center">{item.clauses}</td>
                    <td className="table-center">{item.risks}</td>
                    <td className="table-center">
                      <span className={`status-pill status-pill--${status.level}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default RecentContracts;
