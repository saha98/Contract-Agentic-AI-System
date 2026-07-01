import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";

const COLORS = ["#f5d082", "#c99745", "#5b748f"];

function PortfolioDistributionChart({ data = [] }) {
  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0);

  return (
    <section className="chart-card portfolio-distribution-card">
      <div className="card-header">
        <div>
          <p className="ey-kicker">Portfolio Mix</p>
          <h3 className="card-title">Risk distribution</h3>
          <p className="card-subtitle">A quick read on how reviewed contracts are distributed across current risk levels.</p>
        </div>
      </div>

      {total === 0 ? (
        <div className="empty-state">Distribution will appear once contract reviews are available.</div>
      ) : (
        <div className="distribution-layout enterprise-distribution-layout">
          <div className="donut-shell">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={72}
                  outerRadius={104}
                  paddingAngle={3}
                  stroke="rgba(15, 23, 42, 0.04)"
                >
                  {data.map((entry, index) => (
                    <Cell fill={COLORS[index % COLORS.length]} key={entry.name} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(245, 208, 130, 0.24)",
                    borderRadius: "16px",
                    color: "#f8fafc"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <div>
                <div className="donut-value">{total}</div>
                <div className="donut-caption">reviewed contracts</div>
              </div>
            </div>
          </div>

          <div className="legend-list">
            {data.map((entry, index) => (
              <div className="legend-item" key={entry.name}>
                <div className="legend-name">
                  <span className="legend-swatch" style={{ background: COLORS[index % COLORS.length] }} />
                  {entry.name}
                </div>
                <strong>{entry.value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default PortfolioDistributionChart;
