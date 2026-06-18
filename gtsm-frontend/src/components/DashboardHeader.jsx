function DashboardHeader() {
  const stats = [
    {
      value: 127,
      label: "Contracts Processed"
    },
    {
      value: 48,
      label: "Risks Identified"
    },
    {
      value: 6,
      label: "Active Escalations"
    },
    {
      value: 4,
      label: "Departments"
    }
  ];

  return (
    <section className="page-stack">
      <div className="dashboard-hero">
        <div>
          <p className="ey-kicker">AI Contract Intelligence</p>
          <h2>Enterprise Contract Analytics</h2>
          <p>Risk management, contract analytics, and agentic AI governance platform.</p>
        </div>

        <div className="dashboard-hero-actions">
          <span className="date-chip">Today - Live</span>
        </div>
      </div>

      <div className="metric-grid">
        {stats.map((stat) => (
          <article className="metric-card" key={stat.label}>
            <div>
              <p className="metric-label">{stat.label}</p>
              <div className="metric-value">{stat.value}</div>
            </div>
            <p className="metric-note">Executive signal</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DashboardHeader;
