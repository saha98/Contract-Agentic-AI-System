function EscalationFeed() {
  const escalations = [
    {
      time: "10:42 AM",
      severity: "High",
      title: "Payment Clause Risk Detected"
    },
    {
      time: "10:35 AM",
      severity: "Medium",
      title: "Compliance Review Required"
    },
    {
      time: "10:21 AM",
      severity: "High",
      title: "Liability Clause Escalated"
    },
    {
      time: "09:58 AM",
      severity: "Low",
      title: "Contract Review Completed"
    }
  ];

  const getLevel = (severity) => {
    if (severity === "High") return "high";
    if (severity === "Medium") return "medium";
    return "low";
  };

  return (
    <section className="table-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Active Escalations</h3>
          <p className="card-subtitle">Last 24 hours</p>
        </div>
      </div>

      <div className="feed-list">
        {escalations.map((item) => (
          <article className="feed-item" key={`${item.time}-${item.title}`}>
            <div>
              <div className="feed-title">{item.title}</div>
              <div className="feed-time">{item.time}</div>
            </div>
            <span className={`status-pill status-pill--${getLevel(item.severity)}`}>
              {item.severity}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default EscalationFeed;
