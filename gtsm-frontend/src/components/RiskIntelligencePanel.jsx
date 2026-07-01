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
import { FiAlertTriangle, FiTrendingUp, FiZap } from "react-icons/fi";

function formatLabel(value) {
  return String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function mapPrediction(value) {
  const mapping = {
    0: "Low",
    1: "Medium",
    2: "High",
    3: "Critical"
  };

  return mapping[value] || value;
}

function RiskIntelligencePanel({
  contractFeatures = {},
  mlRiskPrediction = {},
  riskMetrics = {},
  modelConsensus = {}
}) {
  const chartData = [
    {
      label: "ML Risk Score",
      value: Number(mlRiskPrediction.risk_score || 0)
    },
    {
      label: "Escalation %",
      value: Number(mlRiskPrediction.escalation_probability || 0) * 100
    },
    {
      label: "Rule Risk Score",
      value: Number(riskMetrics.risk_score || 0)
    },
    {
      label: "Contract Health",
      value: Number(riskMetrics.contract_health || 0)
    }
  ];

  const featureEntries = Object.entries(contractFeatures);
  const highlightedFeatures = featureEntries.filter(([key, value]) => key !== "payment_days" && Number(value) === 1);
  const paymentDays = Number(contractFeatures.payment_days || 0);

  const consensusRows = modelConsensus
    ? [
        {
          label: "XGBoost",
          value: modelConsensus.xgboost?.risk_class || "N/A"
        },
        {
          label: "Random Forest",
          value: mapPrediction(modelConsensus.random_forest?.prediction ?? "N/A")
        },
        {
          label: "Logistic Regression",
          value: mapPrediction(modelConsensus.logistic_regression?.prediction ?? "N/A")
        }
      ]
    : [];

  return (
    <section className="section-card adaptive-panel">
      <div className="card-header">
        <div>
          <p className="ey-kicker">Risk Intelligence</p>
          <h3 className="card-title">Contract features and predictive signals</h3>
          <p className="card-subtitle">Feature engineering, ML classification, and rules-based risk metrics in one manager-facing view.</p>
        </div>
      </div>

      <div className="adaptive-risk-overview-grid">
        <article className="adaptive-intel-card adaptive-intel-card--emphasis">
          <div className="adaptive-intel-header">
            <div className="adaptive-intel-icon">
              <FiAlertTriangle />
            </div>
            <div>
              <div className="adaptive-intel-label">ML Risk Prediction</div>
              <div className="adaptive-intel-value">{mlRiskPrediction.risk_class || "Pending"}</div>
            </div>
          </div>
          <div className="adaptive-intel-footnote">Risk score {Number(mlRiskPrediction.risk_score || 0).toFixed(2)} / 100</div>
        </article>

        <article className="adaptive-intel-card">
          <div className="adaptive-intel-header">
            <div className="adaptive-intel-icon">
              <FiTrendingUp />
            </div>
            <div>
              <div className="adaptive-intel-label">Escalation Probability</div>
              <div className="adaptive-intel-value">{Math.round(Number(mlRiskPrediction.escalation_probability || 0) * 100)}%</div>
            </div>
          </div>
          <div className="adaptive-intel-footnote">Model-derived likelihood of elevation</div>
        </article>

        <article className="adaptive-intel-card">
          <div className="adaptive-intel-header">
            <div className="adaptive-intel-icon">
              <FiZap />
            </div>
            <div>
              <div className="adaptive-intel-label">Rules Risk Score</div>
              <div className="adaptive-intel-value">{riskMetrics.risk_score ?? 0}</div>
            </div>
          </div>
          <div className="adaptive-intel-footnote">Derived from the risk agent output</div>
        </article>

        <article className="adaptive-intel-card">
          <div className="adaptive-intel-header">
            <div className="adaptive-intel-icon">
              <FiTrendingUp />
            </div>
            <div>
              <div className="adaptive-intel-label">Contract Health</div>
              <div className="adaptive-intel-value">{riskMetrics.contract_health ?? 0}</div>
            </div>
          </div>
          <div className="adaptive-intel-footnote">Residual health after risk weighting</div>
        </article>
      </div>

      <div className="adaptive-risk-split">
        <div className="adaptive-chart-shell">
          <div className="adaptive-subsection-title">Risk metrics</div>
          <div className="adaptive-bar-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tickMargin={10} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} width={34} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(245, 208, 130, 0.24)",
                    borderRadius: "16px",
                    color: "#f8fafc"
                  }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {chartData.map((item) => (
                    <Cell
                      fill={
                        item.label === "Contract Health"
                          ? "#5b748f"
                          : item.label === "Escalation %"
                            ? "#c99745"
                            : "#f5d082"
                      }
                      key={item.label}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="adaptive-feature-shell">
          <div className="adaptive-subsection-title">Contract features</div>
          <div className="adaptive-feature-grid">
            <article className="adaptive-feature-card adaptive-feature-card--numeric">
              <div className="adaptive-feature-label">Payment Days</div>
              <div className="adaptive-feature-value">{paymentDays}</div>
              <div className="adaptive-feature-note">Longest payment timing detected</div>
            </article>

            {featureEntries
              .filter(([key]) => key !== "payment_days")
              .map(([key, value]) => (
                <article className={`adaptive-feature-card ${Number(value) === 1 ? "is-active" : ""}`} key={key}>
                  <div className="adaptive-feature-label">{formatLabel(key)}</div>
                  <div className="adaptive-feature-status">{Number(value) === 1 ? "Present" : "Not detected"}</div>
                </article>
              ))}
          </div>
        </div>
      </div>

      <div className="adaptive-consensus-row">
        <div>
          <div className="adaptive-subsection-title">Model consensus</div>
          <div className="adaptive-consensus-badges">
            {consensusRows.length === 0 ? (
              <span className="adaptive-status-note">Consensus output was not returned for this run.</span>
            ) : (
              consensusRows.map((row) => (
                <span className="adaptive-agent-badge" key={row.label}>
                  {row.label}: {row.value}
                </span>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="adaptive-subsection-title">Triggered features</div>
          <div className="adaptive-consensus-badges">
            {highlightedFeatures.length === 0 ? (
              <span className="adaptive-status-note">No boolean contract features were triggered in the latest run.</span>
            ) : (
              highlightedFeatures.map(([key]) => (
                <span className="adaptive-highlight-pill" key={key}>
                  {formatLabel(key)}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default RiskIntelligencePanel;
