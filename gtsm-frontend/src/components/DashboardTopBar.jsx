import { FiAlertTriangle, FiCheckCircle, FiClock } from "react-icons/fi";

function DashboardTopBar() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  return (
    <section className="dashboard-hero">
      <div>
        <p className="ey-kicker">Executive Dashboard</p>
        <h2>Contract Intelligence Command Center</h2>
        <p>Enterprise contract risk, workflow performance, and governance signals in one view.</p>
      </div>

      <div className="dashboard-hero-actions">
        <span className="alert-chip">
          <FiAlertTriangle />
          3 Alerts
        </span>
        <span className="health-chip">
          <FiCheckCircle />
          System Healthy
        </span>
        <span className="date-chip">
          <FiClock />
          {formattedDate}
        </span>
      </div>
    </section>
  );
}

export default DashboardTopBar;
