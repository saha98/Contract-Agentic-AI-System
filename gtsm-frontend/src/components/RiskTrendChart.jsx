import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

function RiskTrendChart({ data }) {
  return (
    <section className="chart-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Risk Trend Analytics</h3>
          <p className="card-subtitle">Risk count by contract</p>
        </div>
      </div>

      <div className="chart-frame">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="contract" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} width={34} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="risks"
              stroke="#2e2e38"
              strokeWidth={3}
              dot={{ r: 4, fill: "#ffe600", stroke: "#2e2e38", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#ffe600", stroke: "#2e2e38", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default RiskTrendChart;
