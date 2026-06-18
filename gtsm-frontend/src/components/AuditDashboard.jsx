import { useEffect, useState } from "react";
import axios from "axios";

function AuditDashboard() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/audit-dashboard")
      .then((response) => {
        setLogs(response.data.logs || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <section className="table-card">
      <div className="card-header">
        <div>
          <p className="ey-kicker">Audit</p>
          <h2 className="page-heading">Audit Dashboard</h2>
          <p className="page-subtitle">Recorded user activity and processing status.</p>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="empty-state">No audit logs are available yet.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log, index) => (
                <tr key={`${log.timestamp}-${index}`}>
                  <td>{log.timestamp}</td>
                  <td>{log.user}</td>
                  <td>{log.action}</td>
                  <td>
                    <span className="status-pill status-pill--neutral">{log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AuditDashboard;
