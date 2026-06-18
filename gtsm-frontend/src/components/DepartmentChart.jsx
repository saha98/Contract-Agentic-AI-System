import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

function DepartmentChart() {
  const data = [
    {
      name: "Legal",
      value: 60
    },
    {
      name: "Finance",
      value: 25
    },
    {
      name: "Compliance",
      value: 15
    }
  ];

  const colors = ["#ffe600", "#2e2e38", "#7a8190"];

  return (
    <section className="chart-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Department Distribution</h3>
          <p className="card-subtitle">Ownership coverage across functions</p>
        </div>
      </div>

      <div className="distribution-layout">
        <div className="donut-shell">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={54} outerRadius={82} paddingAngle={3}>
                {data.map((item, index) => (
                  <Cell key={item.name} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="donut-center">
            <div>
              <div className="donut-value">100%</div>
              <div className="donut-caption">Coverage</div>
            </div>
          </div>
        </div>

        <div className="legend-list">
          {data.map((item, index) => (
            <div className="legend-item" key={item.name}>
              <span className="legend-name">
                <span className={`legend-swatch legend-swatch--${index}`} />
                {item.name}
              </span>
              <strong>{item.value}%</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DepartmentChart;
