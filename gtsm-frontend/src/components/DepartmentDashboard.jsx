import { useEffect, useState } from "react";
import axios from "axios";

function DepartmentDashboard() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/department-dashboard")
      .then((response) => {
        setDepartments(response.data.departments || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="ey-kicker">Department Operations</p>
          <h2 className="page-heading">Department Intelligence Dashboard</h2>
          <p className="page-subtitle">Case ownership and operating status by department.</p>
        </div>
      </header>

      <section className="table-card">
        {departments.length === 0 ? (
          <div className="empty-state">No department records are available yet.</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th className="table-center">Open Cases</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {departments.map((dept, index) => (
                  <tr key={`${dept.name}-${index}`}>
                    <td>
                      <strong className="entity-title">{dept.name}</strong>
                    </td>
                    <td className="table-center">{dept.open_cases}</td>
                    <td>
                      <span className="status-pill status-pill--neutral">{dept.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default DepartmentDashboard;
