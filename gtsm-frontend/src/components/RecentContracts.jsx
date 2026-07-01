import { FiDownload, FiFileText } from "react-icons/fi";

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
});

function formatDate(value) {
  if (!value) {
    return "No activity yet";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return formatter.format(parsed);
}

function getStatus(riskCount) {
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
}

function cleanContractName(name) {
  return (name || "Contract").replace(/\.[^.]+$/, "");
}

function RecentContracts({
  history = [],
  limit,
  title = "Recent Contracts",
  subtitle = "Last contract reviews",
  showDate = false,
  showSummary = false,
  onDownloadRecord
}) {
  const visibleHistory = typeof limit === "number" ? history.slice(0, limit) : history;

  return (
    <section className="table-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">{title}</h3>
          <p className="card-subtitle">{subtitle}</p>
        </div>
      </div>

      {visibleHistory.length === 0 ? (
        <div className="empty-state">No contracts have been processed yet.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Contract</th>
                {showDate ? <th>Uploaded</th> : null}
                <th className="table-center">Clauses</th>
                <th className="table-center">Risks</th>
                <th className="table-center">Status</th>
                {showSummary ? <th>Executive Summary</th> : null}
                {onDownloadRecord ? <th className="table-center">Download</th> : null}
              </tr>
            </thead>

            <tbody>
              {visibleHistory.map((item, index) => {
                const status = getStatus(Number(item.risks || 0));

                return (
                  <tr
                    className={`data-row data-row--${status.level} ${onDownloadRecord ? "data-row--interactive" : ""}`}
                    key={`${item.contract}-${index}`}
                    onClick={onDownloadRecord ? () => onDownloadRecord(item) : undefined}
                  >
                    <td>
                      <div className="entity-cell">
                        <span className="entity-icon">
                          <FiFileText />
                        </span>
                        <div>
                          <div className="entity-title">{cleanContractName(item.contract)}</div>
                          <div className="entity-subtitle">Uploaded contract</div>
                        </div>
                      </div>
                    </td>
                    {showDate ? <td className="table-date">{formatDate(item.upload_date)}</td> : null}
                    <td className="table-center">{item.clauses}</td>
                    <td className="table-center">{item.risks}</td>
                    <td className="table-center">
                      <span className={`status-pill status-pill--${status.level}`}>{status.label}</span>
                    </td>
                    {showSummary ? (
                      <td>
                        <div className="summary-cell">{item.summary || "Executive summary not available for this record yet."}</div>
                      </td>
                    ) : null}
                    {onDownloadRecord ? (
                      <td className="table-center">
                        <button
                          className="download-inline-button"
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDownloadRecord(item);
                          }}
                        >
                          <FiDownload />
                          TXT
                        </button>
                      </td>
                    ) : null}
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
