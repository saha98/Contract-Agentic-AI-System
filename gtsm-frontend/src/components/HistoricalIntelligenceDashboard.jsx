import { useEffect, useState } from "react";
import axios from "axios";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { FiAlertTriangle, FiFileText, FiLayers, FiSearch, FiUpload } from "react-icons/fi";

function HistoricalIntelligenceDashboard() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const totalContracts = history.length;

  const totalRisks = history.reduce((sum, item) => sum + Number(item.risks || 0), 0);

  const totalClauses = history.reduce((sum, item) => sum + Number(item.clauses || 0), 0);

  const avgClauses = totalContracts > 0 ? (totalClauses / totalContracts).toFixed(1) : 0;

  const latestUpload = history.length > 0 ? history[history.length - 1].upload_date : "N/A";

  const filteredHistory = history.filter((item) =>
    (item.contract || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = history.map((item, index) => ({
    contract: `C${index + 1}`,
    clauses: Number(item.clauses || 0),
    risks: Number(item.risks || 0)
  }));

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/contract-history");
        setHistory(response.data.history || []);
      } catch (error) {
        console.error("History Fetch Error:", error);
      }
    };

    fetchHistory();
  }, []);

  const cards = [
    {
      title: "Total Contracts",
      value: totalContracts,
      note: "Historical records",
      icon: <FiFileText />
    },
    {
      title: "Total Risks",
      value: totalRisks,
      note: "Risks identified",
      icon: <FiAlertTriangle />
    },
    {
      title: "Average Clauses",
      value: avgClauses,
      note: "Per contract",
      icon: <FiLayers />
    },
    {
      title: "Latest Upload",
      value: latestUpload,
      note: "Most recent record",
      icon: <FiUpload />,
      isDate: true
    }
  ];

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="ey-kicker">Historical Intelligence</p>
          <h2 className="page-heading">Historical Intelligence Dashboard</h2>
          <p className="page-subtitle">Trend, search, and review history across processed contracts.</p>
        </div>
      </header>

      <section className="metric-grid" aria-label="Historical KPIs">
        {cards.map((card) => (
          <article className="metric-card" key={card.title}>
            <div>
              <div className="metric-card-header">
                <p className="metric-label">{card.title}</p>
                <div className="metric-icon">{card.icon}</div>
              </div>
              <div className={`metric-value ${card.isDate ? "metric-value--small" : ""}`}>
                {card.value}
              </div>
            </div>
            <p className="metric-note">{card.note}</p>
          </article>
        ))}
      </section>

      <section className="chart-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Contract Analytics Trend</h3>
            <p className="card-subtitle">Clauses and risks across historical uploads.</p>
          </div>
        </div>

        <div className="chart-frame">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="contract" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} width={34} />
              <Tooltip />
              <Line type="monotone" dataKey="clauses" stroke="#2e2e38" strokeWidth={3} />
              <Line type="monotone" dataKey="risks" stroke="#ffe600" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="table-card">
        <div className="history-controls">
          <div>
            <h3 className="card-title">Contract History</h3>
            <p className="card-subtitle">Showing {filteredHistory.length} contracts</p>
          </div>

          <div className="search-shell">
            <FiSearch />
            <input
              className="search-input"
              type="text"
              placeholder="Search contract..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="empty-state">No contracts match the current search.</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Contract</th>
                  <th>Upload Date</th>
                  <th className="table-center">Clauses</th>
                  <th className="table-center">Risks</th>
                  <th>Executive Summary</th>
                </tr>
              </thead>

              <tbody>
                {filteredHistory.map((item, index) => (
                  <tr key={`${item.contract}-${index}`}>
                    <td>
                      <strong className="entity-title">{item.contract}</strong>
                    </td>
                    <td>{item.upload_date}</td>
                    <td className="table-center">{item.clauses}</td>
                    <td className="table-center">{item.risks}</td>
                    <td>{item.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default HistoricalIntelligenceDashboard;
