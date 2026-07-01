import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowRight,
  FiClock,
  FiShield,
  FiTrendingUp
} from "react-icons/fi";

import "./App.css";

import ContractUpload from "./components/ContractUpload";
import AdaptiveWorkflowPage from "./components/AdaptiveWorkflowPage";
import ExecutiveKPIs from "./components/ExecutiveKPIs";
import PortfolioDistributionChart from "./components/PortfolioDistributionChart";
import RecentContracts from "./components/RecentContracts";
import RiskTrendChart from "./components/RiskTrendChart";
import {
  downloadTextFile,
  sanitizeFilename
} from "./utils/downloads";

const INITIAL_METRICS = {
  contracts: 0,
  total_risks: 0,
  high_risk_contracts: 0,
  agent_runs: 0
};

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
});

function formatDate(value) {
  if (!value) {
    return "No activity yet";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return formatter.format(parsed);
}

function sortHistory(records) {
  return records.slice().sort((left, right) => {
    const leftTime = new Date(left.upload_date || 0).getTime();
    const rightTime = new Date(right.upload_date || 0).getTime();

    return rightTime - leftTime;
  });
}

function cleanContractName(name) {
  return (name || "Contract").replace(/\.[^.]+$/, "");
}

function shortenContractName(name) {
  const cleaned = cleanContractName(name);

  if (cleaned.length <= 22) {
    return cleaned;
  }

  return `${cleaned.slice(0, 19)}...`;
}

function getRiskStatus(riskCount) {
  if (riskCount >= 5) {
    return {
      label: "High",
      level: "high"
    };
  }

  if (riskCount >= 2) {
    return {
      label: "Medium",
      level: "medium"
    };
  }

  return {
    label: "Low",
    level: "low"
  };
}

function buildRecordDownloadText(record) {
  return [
    `Contract: ${cleanContractName(record.contract)}`,
    `Uploaded: ${formatDate(record.upload_date)}`,
    `Clauses: ${record.clauses || 0}`,
    `Risks: ${record.risks || 0}`,
    `Executive Summary:`,
    record.summary || "Executive summary not available for this record yet."
  ].join("\n");
}

function App() {
  const [activeTab, setActiveTab] = useState("adaptive");
  const [history, setHistory] = useState([]);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(false);
  const [workspaceNotice, setWorkspaceNotice] = useState("");

  const refreshWorkspace = async () => {
    setIsWorkspaceLoading(true);
    setWorkspaceNotice("");

    const [historyResponse, metricsResponse] = await Promise.allSettled([
      axios.get("http://localhost:8000/contract-history"),
      axios.get("http://localhost:8000/executive-metrics")
    ]);

    let hadFailure = false;

    if (historyResponse.status === "fulfilled") {
      setHistory(historyResponse.value.data.history || []);
    } else {
      hadFailure = true;
      console.error("Unable to load contract history:", historyResponse.reason);
    }

    if (metricsResponse.status === "fulfilled") {
      setMetrics({
        ...INITIAL_METRICS,
        ...metricsResponse.value.data
      });
    } else {
      hadFailure = true;
      console.error("Unable to load executive metrics:", metricsResponse.reason);
    }

    if (hadFailure) {
      setWorkspaceNotice("Some live workspace data could not be refreshed. Verify the backend services and retry.");
    }

    setIsWorkspaceLoading(false);
  };

  useEffect(() => {
    void refreshWorkspace();
  }, []);

  const orderedHistory = sortHistory(history);
  const visibleTrendHistory = orderedHistory.slice(0, 6).reverse();
  const watchList = orderedHistory
    .slice()
    .sort((left, right) => Number(right.risks || 0) - Number(left.risks || 0))
    .slice(0, 3);

  const contractCount = metrics.contracts || orderedHistory.length;
  const totalRisks =
    metrics.total_risks || orderedHistory.reduce((sum, item) => sum + Number(item.risks || 0), 0);
  const highRiskContracts =
    metrics.high_risk_contracts || orderedHistory.filter((item) => Number(item.risks || 0) >= 5).length;
  const totalClauses = orderedHistory.reduce((sum, item) => sum + Number(item.clauses || 0), 0);
  const averageClauses = contractCount ? Math.round(totalClauses / contractCount) : 0;
  const averageRisks = contractCount ? (totalRisks / contractCount).toFixed(1) : "0.0";
  const flaggedShare = contractCount ? Math.round((highRiskContracts / contractCount) * 100) : 0;
  const portfolioHealth = contractCount
    ? Math.max(54, Math.min(96, Math.round(100 - flaggedShare * 0.72 - Number(averageRisks) * 7)))
    : 92;
  const latestContract = orderedHistory[0];
  const agentRuns = metrics.agent_runs || 0;
  const trendData = visibleTrendHistory.map((item) => ({
    contract: shortenContractName(item.contract),
    risks: Number(item.risks || 0)
  }));
  const riskDistributionData = [
    {
      name: "High",
      value: orderedHistory.filter((item) => Number(item.risks || 0) >= 5).length
    },
    {
      name: "Medium",
      value: orderedHistory.filter((item) => Number(item.risks || 0) >= 2 && Number(item.risks || 0) < 5).length
    },
    {
      name: "Low",
      value: orderedHistory.filter((item) => Number(item.risks || 0) < 2).length
    }
  ];

  const portfolioMessage = highRiskContracts
    ? `${highRiskContracts} contract${highRiskContracts === 1 ? "" : "s"} need elevated review attention.`
    : contractCount
      ? "Risk posture is currently stable with no high-risk contracts flagged."
      : "Upload a contract to initialize portfolio monitoring and live review metrics.";

  const focusItems = [
    {
      icon: <FiShield />,
      label: "Portfolio posture",
      title: portfolioHealth >= 80 ? "Stable operating window" : "Elevated risk pressure",
      copy: portfolioMessage
    },
    {
      icon: <FiClock />,
      label: "Latest review",
      title: latestContract ? cleanContractName(latestContract.contract) : "No reviewed contracts yet",
      copy: latestContract
        ? `${formatDate(latestContract.upload_date)} | ${latestContract.clauses || 0} clauses analyzed`
        : "The first completed review will appear here."
    },
    {
      icon: <FiTrendingUp />,
      label: "Automation cadence",
      title: `${agentRuns} orchestration run${agentRuns === 1 ? "" : "s"} logged`,
      copy: agentRuns
        ? "Operational workflows are feeding the executive dashboard."
        : "Run contract reviews to build an audit-ready operating trail."
    }
  ];

  const activityItems = orderedHistory.slice(0, 4).map((item) => ({
    contract: cleanContractName(item.contract),
    date: formatDate(item.upload_date),
    clauses: Number(item.clauses || 0),
    risks: Number(item.risks || 0),
    status: getRiskStatus(Number(item.risks || 0))
  }));

  const handleDownloadRecord = (record) => {
    const filename = `${sanitizeFilename(cleanContractName(record.contract), "contract_summary")}_executive_summary.txt`;
    downloadTextFile(filename, buildRecordDownloadText(record));
  };

  const handleDownloadAllSummaries = () => {
    const content = orderedHistory.length
      ? orderedHistory.map((record) => buildRecordDownloadText(record)).join("\n\n----------------------------------------\n\n")
      : "No contract history is available yet.";

    downloadTextFile("contract_executive_summaries.txt", content);
  };

  return (
    <div className="app-shell">
      <div className="main-shell">
        <header className="app-header">
          <div className="app-header-content">
            <div className="app-header-row">
              <div className="app-brand">
                <div className="app-logo">CA</div>
                <div>
                  <h1 className="app-title">Contract Intelligence Command Center</h1>
                  <p className="app-subtitle">Enterprise review, historical governance, and live risk visibility</p>
                </div>
              </div>

              <div className="header-actions">
                <span className="signal-chip signal-chip--live">
                  <FiActivity />
                  Live backend sync
                </span>
                <span className="signal-chip">
                  <FiShield />
                  Precision review mode
                </span>
                <div className="user-chip">
                  <div className="avatar">SL</div>
                  <div className="user-meta">
                    <div className="user-name">Strategy Lead</div>
                    <div className="user-role">Contract Operations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="page-content">
          <section className="hero-grid">
            <article className="command-card">
              <div className="hero-kicker-row">
                <span className="ey-kicker">Executive Control Layer</span>
                <div className="hero-badge-row">
                  <span className="hero-badge">Adaptive orchestration</span>
                  <span className="hero-badge">AI review</span>
                  <span className="hero-badge">Audit-ready trail</span>
                  <span className="hero-badge">Portfolio governance</span>
                </div>
              </div>

              <h2 className="hero-title">Sharper contract decisions, presented like an operating system.</h2>
              <p className="hero-subtitle">
                Move between live intake, executive metrics, and review history with a clearer visual hierarchy and stronger portfolio context.
              </p>

              <div className="hero-stat-grid">
                <div className="hero-stat-card">
                  <span className="hero-stat-label">Portfolio Health</span>
                  <strong className="hero-stat-value">{portfolioHealth}</strong>
                  <span className="hero-stat-note">composite governance score</span>
                </div>
                <div className="hero-stat-card">
                  <span className="hero-stat-label">Avg. Risk Load</span>
                  <strong className="hero-stat-value">{averageRisks}</strong>
                  <span className="hero-stat-note">identified risks per contract</span>
                </div>
                <div className="hero-stat-card">
                  <span className="hero-stat-label">Flagged Share</span>
                  <strong className="hero-stat-value">{flaggedShare}%</strong>
                  <span className="hero-stat-note">portfolio requiring closer review</span>
                </div>
              </div>

              {workspaceNotice ? <div className="notice-banner">{workspaceNotice}</div> : null}
            </article>

            <aside className="section-card focus-card">
              <div className="card-header">
                <div>
                  <p className="ey-kicker">Operational Focus</p>
                  <h3 className="card-title">What deserves attention now</h3>
                  <p className="card-subtitle">A concise portfolio narrative for review leaders.</p>
                </div>
              </div>

              <div className="focus-list">
                {focusItems.map((item) => (
                  <div className="focus-item" key={item.label}>
                    <div className="focus-item-icon">{item.icon}</div>
                    <div>
                      <div className="focus-item-label">{item.label}</div>
                      <div className="focus-item-title">{item.title}</div>
                      <p className="focus-item-copy">{item.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </section>

          <nav className="app-tabs">
            <button
              className={`app-tab ${activeTab === "adaptive" ? "active" : ""}`}
              onClick={() => setActiveTab("adaptive")}
              type="button"
            >
              Adaptive Workflow
            </button>
            <button
              className={`app-tab ${activeTab === "contracts" ? "active" : ""}`}
              onClick={() => setActiveTab("contracts")}
              type="button"
            >
              Contract Studio
            </button>
            <button
              className={`app-tab ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
              type="button"
            >
              Executive Dashboard
            </button>
            <button
              className={`app-tab ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
              type="button"
            >
              Review History
            </button>
            <button className="secondary-button tabs-refresh-button" onClick={refreshWorkspace} disabled={isWorkspaceLoading} type="button">
              {isWorkspaceLoading ? "Refreshing..." : "Refresh Data"}
            </button>
          </nav>

          <section className="tab-content">
            <div className={`workspace-pane ${activeTab === "adaptive" ? "is-active" : ""}`} aria-hidden={activeTab !== "adaptive"}>
              <AdaptiveWorkflowPage />
            </div>

            <div className={`workspace-pane ${activeTab === "contracts" ? "is-active" : ""}`} aria-hidden={activeTab !== "contracts"}>
              <ContractUpload onProcessingComplete={refreshWorkspace} />
            </div>

            <div className={`workspace-pane ${activeTab === "dashboard" ? "is-active" : ""}`} aria-hidden={activeTab !== "dashboard"}>
              <div className="dashboard-wrapper">
                <ExecutiveKPIs metrics={metrics} />

                <div className="dashboard-grid dashboard-grid--split">
                  <RiskTrendChart data={trendData} />
                  <PortfolioDistributionChart data={riskDistributionData} />
                </div>

                <div className="dashboard-grid dashboard-grid--split">
                  <section className="section-card portfolio-card">
                    <div className="card-header">
                      <div>
                        <p className="ey-kicker">Portfolio Quality</p>
                        <h3 className="card-title">Review pressure overview</h3>
                        <p className="card-subtitle">Use these signals to decide where legal attention should shift next.</p>
                      </div>
                    </div>

                    <div className="portfolio-score-row">
                      <div className="portfolio-score-shell">
                        <div className="portfolio-score-ring">{portfolioHealth}</div>
                        <div>
                          <div className="portfolio-score-caption">Governance confidence</div>
                          <p className="focus-item-copy">
                            {portfolioHealth >= 80
                              ? "The current portfolio sits in a controlled range with targeted exceptions."
                              : "Risk concentration is rising and should be triaged with additional reviewer attention."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="portfolio-breakdown">
                      <div className="breakdown-row">
                        <div className="breakdown-label">Flagged Contracts</div>
                        <div className="breakdown-track">
                          <span className="breakdown-fill breakdown-fill--amber" style={{ width: `${flaggedShare}%` }} />
                        </div>
                        <div className="breakdown-value">{highRiskContracts}</div>
                      </div>

                      <div className="breakdown-row">
                        <div className="breakdown-label">Average Clause Density</div>
                        <div className="breakdown-track">
                          <span
                            className="breakdown-fill breakdown-fill--slate"
                            style={{ width: `${Math.min(100, Math.round((averageClauses / 80) * 100))}%` }}
                          />
                        </div>
                        <div className="breakdown-value">{averageClauses}</div>
                      </div>

                      <div className="breakdown-row">
                        <div className="breakdown-label">Workflow Automation</div>
                        <div className="breakdown-track">
                          <span
                            className="breakdown-fill breakdown-fill--ink"
                            style={{ width: `${Math.min(100, contractCount ? Math.round((agentRuns / contractCount) * 18) : 0)}%` }}
                          />
                        </div>
                        <div className="breakdown-value">{agentRuns}</div>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="dashboard-grid dashboard-grid--split">
                  <RecentContracts
                    history={orderedHistory}
                    limit={5}
                    showDate
                    title="Latest Contract Reviews"
                    subtitle="Most recent items flowing through the portfolio"
                    onDownloadRecord={handleDownloadRecord}
                  />

                  <section className="section-card activity-card">
                    <div className="card-header">
                      <div>
                        <p className="ey-kicker">Recent Signals</p>
                        <h3 className="card-title">Live review feed</h3>
                        <p className="card-subtitle">A tighter scan of what has moved through the system most recently.</p>
                      </div>
                    </div>

                    {activityItems.length === 0 ? (
                      <div className="empty-state">Run a contract review to populate the live activity feed.</div>
                    ) : (
                      <div className="feed-list">
                        {activityItems.map((item) => (
                          <div className={`feed-item feed-item--${item.status.level}`} key={`${item.contract}-${item.date}`}>
                            <div className="feed-meta">
                              <div className="feed-title">{item.contract}</div>
                              <div className="feed-subtitle">{item.clauses} clauses reviewed</div>
                              <div className="feed-time">{item.date}</div>
                            </div>
                            <div className="feed-status">
                              <span className={`status-pill status-pill--${item.status.level}`}>{item.status.label}</span>
                              <span className="feed-risk-count">{item.risks} risks</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>

            <div className={`workspace-pane ${activeTab === "history" ? "is-active" : ""}`} aria-hidden={activeTab !== "history"}>
              <div className="dashboard-wrapper">
                <section className="section-card history-summary-card">
                  <div className="card-header">
                    <div>
                      <p className="ey-kicker">Portfolio Ledger</p>
                      <h3 className="card-title">Historical contract intelligence</h3>
                      <p className="card-subtitle">A record of uploaded contracts, observed risk levels, and executive summaries.</p>
                    </div>
                    <div className="history-summary-actions">
                      <button className="secondary-button" onClick={handleDownloadAllSummaries} type="button">
                        Download All TXT
                      </button>
                      <button className="secondary-button" onClick={() => setActiveTab("contracts")} type="button">
                        Open Review Studio
                        <FiArrowRight />
                      </button>
                    </div>
                  </div>

                  <div className="hero-stat-grid hero-stat-grid--history">
                    <div className="hero-stat-card hero-stat-card--light">
                      <span className="hero-stat-label">Contracts Managed</span>
                      <strong className="hero-stat-value">{contractCount}</strong>
                      <span className="hero-stat-note">indexed records in history</span>
                    </div>
                    <div className="hero-stat-card hero-stat-card--light">
                      <span className="hero-stat-label">Total Risks</span>
                      <strong className="hero-stat-value">{totalRisks}</strong>
                      <span className="hero-stat-note">cumulative issues flagged</span>
                    </div>
                    <div className="hero-stat-card hero-stat-card--light">
                      <span className="hero-stat-label">Latest Activity</span>
                      <strong className="hero-stat-value hero-stat-value--compact">
                        {latestContract ? formatDate(latestContract.upload_date) : "Waiting"}
                      </strong>
                      <span className="hero-stat-note">most recent upload window</span>
                    </div>
                  </div>
                </section>

                <div className="dashboard-grid dashboard-grid--split">
                  <RecentContracts
                    history={orderedHistory}
                    showDate
                    showSummary
                    title="Review History"
                    subtitle="Complete record of processed contracts"
                    onDownloadRecord={handleDownloadRecord}
                  />

                  <section className="section-card activity-card">
                    <div className="card-header">
                      <div>
                        <p className="ey-kicker">Priority Watchlist</p>
                        <h3 className="card-title">Contracts that need a second look</h3>
                        <p className="card-subtitle">Highest-risk items are surfaced here for quick escalation decisions.</p>
                      </div>
                    </div>

                    {watchList.length === 0 ? (
                      <div className="empty-state">The watchlist will populate once reviewed contracts are available.</div>
                    ) : (
                      <div className="focus-list">
                        {watchList.map((item, index) => {
                          const status = getRiskStatus(Number(item.risks || 0));

                          return (
                            <div className="focus-item watchlist-item" key={`${item.contract}-${index}`}>
                              <div className="focus-item-icon">
                                {status.level === "high" ? <FiAlertTriangle /> : <FiTrendingUp />}
                              </div>
                              <div>
                                <div className="focus-item-label">Priority #{index + 1}</div>
                                <div className="focus-item-title">{cleanContractName(item.contract)}</div>
                                <p className="focus-item-copy">
                                  {formatDate(item.upload_date)} | {item.clauses || 0} clauses | {item.risks || 0} risks flagged
                                </p>
                                <span className={`status-pill status-pill--${status.level}`}>{status.label} Priority</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
