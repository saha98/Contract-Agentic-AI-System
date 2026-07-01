import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";

function formatLabel(value) {
  return String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function ExplainabilityPanel({ topFactors = [] }) {
  const chartData = topFactors.slice(0, 6).map((factor) => ({
    ...factor,
    label: formatLabel(factor.feature)
  }));

  return (
    <section className="section-card adaptive-panel">
      <div className="card-header">
        <div>
          <p className="ey-kicker">SHAP Explainability</p>
          <h3 className="card-title">Top factors behind the prediction</h3>
          <p className="card-subtitle">The largest contributors are ranked below so reviewers can see what pushed the model most strongly.</p>
        </div>
      </div>

      {topFactors.length === 0 ? (
        <div className="empty-state">Explainability factors were not returned for this workflow run.</div>
      ) : (
        <>
          <div className="adaptive-explainability-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 18, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="label" axisLine={false} tickLine={false} width={128} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(245, 208, 130, 0.24)",
                    borderRadius: "16px",
                    color: "#f8fafc"
                  }}
                />
                <Bar dataKey="impact" radius={[0, 10, 10, 0]}>
                  {chartData.map((item) => (
                    <Cell fill={Number(item.impact) >= 0 ? "#f5d082" : "#6e8298"} key={item.feature} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="adaptive-factor-list">
            {topFactors.slice(0, 8).map((factor) => (
              <article className="adaptive-factor-card" key={`${factor.feature}-${factor.impact}`}>
                <div className="adaptive-factor-header">
                  <div>
                    <div className="adaptive-factor-title">{formatLabel(factor.feature)}</div>
                    <div className="adaptive-factor-meta">Feature value: {factor.value}</div>
                  </div>
                  <span className={`status-pill status-pill--${Number(factor.impact) >= 0 ? "medium" : "info"}`}>
                    {Number(factor.impact) >= 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
                    {Number(factor.impact) >= 0 ? "Raises Risk" : "Reduces Risk"}
                  </span>
                </div>
                <div className="adaptive-factor-impact">Impact {Number(factor.impact).toFixed(4)}</div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default ExplainabilityPanel;
