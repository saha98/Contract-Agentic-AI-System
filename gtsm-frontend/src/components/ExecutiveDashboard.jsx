import { useEffect, useState } from "react";
import axios from "axios";

function ExecutiveDashboard() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/executive-dashboard")
      .then((response) => {
        setRecords(response.data.records || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="ey-kicker">Risk Governance</p>
          <h2 className="page-heading">Executive Risk Center</h2>
          <p className="page-subtitle">Contract risks, department routing, and generated insights.</p>
        </div>
      </header>

      {records.length === 0 ? (
        <section className="tool-card">
          <div className="empty-state">No executive risk records are available yet.</div>
        </section>
      ) : (
        <section className="record-grid">
          {records.map((item, index) => (
            <article className="record-card" key={index}>
              <div className="card-header">
                <div>
                  <h3 className="card-title">Contract #{index + 1}</h3>
                  <p className="card-subtitle">Risk review package</p>
                </div>
                <span className="status-pill status-pill--info">Review</span>
              </div>

              <div className="record-columns">
                <div>
                  <h4 className="card-title">Risks</h4>
                  <pre className="json-block">{JSON.stringify(item.risks, null, 2)}</pre>
                </div>
                <div>
                  <h4 className="card-title">Departments</h4>
                  <pre className="json-block">{JSON.stringify(item.departments, null, 2)}</pre>
                </div>
                <div>
                  <h4 className="card-title">Insights</h4>
                  <pre className="json-block">{JSON.stringify(item.insights, null, 2)}</pre>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default ExecutiveDashboard;
