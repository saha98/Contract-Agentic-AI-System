import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

function RiskTrendChart({ data = [] }) {
  return (
    <section className="chart-card">
      <div className="card-header">
        <div>
          <p className="ey-kicker">Trend Signal</p>
          <h3 className="card-title">Recent portfolio risk movement</h3>
          <p className="card-subtitle">Track how recent contracts are concentrating or easing portfolio risk.</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="empty-state">Risk movement will appear here once reviewed contracts are available.</div>
      ) : (
        <div className="chart-frame">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
              <CartesianGrid stroke="rgba(95, 110, 130, 0.14)" vertical={false} />
              <XAxis dataKey="contract" axisLine={false} tickLine={false} tickMargin={12} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} width={32} />
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid rgba(134, 145, 162, 0.2)",
                  background: "rgba(15, 23, 42, 0.94)",
                  color: "#f8fafc",
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.22)"
                }}
                cursor={{ stroke: "rgba(191, 145, 78, 0.35)", strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="risks"
                stroke="#bf914e"
                strokeWidth={3}
                dot={{ r: 4, fill: "#f6f3ec", stroke: "#bf914e", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#bf914e", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default RiskTrendChart;
