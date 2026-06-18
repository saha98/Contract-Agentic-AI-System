import { useEffect, useState } from "react";
import axios from "axios";

import DashboardTopBar from "./DashboardTopBar";
import DepartmentChart from "./DepartmentChart";
import EscalationFeed from "./EscalationFeed";
import ExecutiveAnalyticsRow from "./ExecutiveAnalyticsRow";
import ExecutiveKPIs from "./ExecutiveKPIs";
import RecentContracts from "./RecentContracts";
import RiskTrendChart from "./RiskTrendChart";

function ExecutiveCommandCenter() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/contract-history")
      .then((response) => {
        setHistory(response.data.history || []);
      })
      .catch(console.error);
  }, []);

  const chartData = history.map((item, index) => ({
    contract: `C${index + 1}`,
    clauses: Number(item.clauses || 0),
    risks: Number(item.risks || 0)
  }));

  return (
    <div className="dashboard-shell">
      <DashboardTopBar />
      <ExecutiveKPIs />
      <ExecutiveAnalyticsRow />

      <div className="dashboard-grid dashboard-grid--split">
        <RiskTrendChart data={chartData} />
        <DepartmentChart />
      </div>

      <div className="dashboard-grid dashboard-grid--equal">
        <RecentContracts history={history} />
        <EscalationFeed />
      </div>
    </div>
  );
}

export default ExecutiveCommandCenter;
