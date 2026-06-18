import { useState } from "react";

import "./App.css";

import Sidebar from "./components/Sidebar";
import ContractUpload from "./components/ContractUpload";
import ExecutiveDashboard from "./components/ExecutiveDashboard";
import DepartmentDashboard from "./components/DepartmentDashboard";
import AuditDashboard from "./components/AuditDashboard";
import AgentAnalytics from "./components/AgentAnalytics";
import HistoricalIntelligenceDashboard from "./components/HistoricalIntelligenceDashboard";
import AgentMonitor from "./components/AgentMonitor";
import WorkflowDecision from "./components/WorkflowDecision";
import TopNavbar from "./components/TopNavbar";
import ExecutiveCommandCenter from "./components/ExecutiveCommandCenter";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  const handleLogin = () => {
    setLoggedIn(true);
  };

  if (!loggedIn) {
    return (
      <main className="app-login-shell">
        <section className="login-panel" aria-label="Sign in">
          <div className="login-brand">
            <div className="brand-mark">EY</div>
            <div>
              <h1 className="login-title">EY AI</h1>
              <p className="login-subtitle">Contract Intelligence Platform</p>
            </div>
          </div>

          <div className="login-form">
            <label className="form-label">
              Email
              <input className="form-input" type="text" placeholder="name@company.com" />
            </label>

            <label className="form-label">
              Password
              <input className="form-input" type="password" placeholder="Enter your password" />
            </label>

            <button className="primary-button" type="button" onClick={handleLogin}>
              Login
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="main-shell">
        <TopNavbar activePage={activePage} />

        <main className="page-content">
          {activePage === "Dashboard" && <ExecutiveCommandCenter />}

          {activePage === "Contracts" && <ContractUpload />}

          {activePage === "Risk Center" && <ExecutiveDashboard />}

          {activePage === "Departments" && <DepartmentDashboard />}

          {activePage === "Audit" && (
            <div className="page-stack">
              <AuditDashboard />
              <WorkflowDecision />
            </div>
          )}

          {activePage === "Analytics" && (
            <div className="page-stack">
              <AgentAnalytics />
              <AgentMonitor />
            </div>
          )}

          {activePage === "History" && <HistoricalIntelligenceDashboard />}

          {activePage === "Settings" && (
            <div className="page-stack">
              <header className="page-header">
                <div>
                  <p className="ey-kicker">Administration</p>
                  <h2 className="page-heading">Platform Settings</h2>
                  <p className="page-subtitle">Governance, access, and operating controls.</p>
                </div>
              </header>

              <section className="tool-card">
                <div className="settings-grid">
                  <article className="settings-item">
                    <h3>User Management</h3>
                    <p>Manage platform users and invitation status.</p>
                  </article>
                  <article className="settings-item">
                    <h3>Role Configuration</h3>
                    <p>Maintain operating roles for review and approval teams.</p>
                  </article>
                  <article className="settings-item">
                    <h3>Access Control</h3>
                    <p>Review controls for data, reports, and executive dashboards.</p>
                  </article>
                  <article className="settings-item">
                    <h3>Platform Configuration</h3>
                    <p>Configure contract intelligence workflows and defaults.</p>
                  </article>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
