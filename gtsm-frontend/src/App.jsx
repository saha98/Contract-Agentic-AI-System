import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

import ContractUpload from "./components/ContractUpload";
import ExecutiveKPIs from "./components/ExecutiveKPIs";
import RecentContracts from "./components/RecentContracts";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("contracts");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!loggedIn) return;

    axios
      .get("http://localhost:8000/contract-history")
      .then((response) => {
        setHistory(response.data.history || []);
      })
      .catch((error) => {
        console.error("Unable to load contract history:", error);
      });
  }, [loggedIn]);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  if (!loggedIn) {
    return (
      <main className="app-login-shell">
        <section className="login-panel" aria-label="Sign in">
          <div className="login-brand">
            <div className="brand-mark">CA</div>
            <div>
              <h1 className="login-title">Contract AI</h1>
              <p className="login-subtitle">Enterprise contract intelligence for faster review and safer deals.</p>
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
              Sign In
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <div className="main-shell">
        <header className="app-header">
          <div className="app-header-content">
            <div className="app-brand">
              <div className="app-logo">CA</div>
              <div>
                <h1 className="app-title">Contract Intelligence</h1>
                <p className="app-subtitle">Enterprise Contract Analysis & Management</p>
              </div>
            </div>
          </div>
        </header>

        <nav className="app-tabs">
          <button
            className={`app-tab ${activeTab === "contracts" ? "active" : ""}`}
            onClick={() => setActiveTab("contracts")}
          >
            Contract Analysis
          </button>
          <button
            className={`app-tab ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`app-tab ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Historical Data
          </button>
        </nav>

        <main className="page-content">
          {activeTab === "contracts" && (
            <section className="tab-content">
              <ContractUpload />
            </section>
          )}

          {activeTab === "dashboard" && (
            <section className="tab-content">
              <div className="dashboard-wrapper">
                <ExecutiveKPIs />
                <RecentContracts history={history} />
              </div>
            </section>
          )}

          {activeTab === "history" && (
            <section className="tab-content">
              <div className="history-wrapper">
                <header className="section-header">
                  <div>
                    <p className="ey-kicker">Historical Data</p>
                    <h2 className="section-title">Contract Processing History</h2>
                    <p className="section-subtitle">All uploaded contracts and their analysis results.</p>
                  </div>
                </header>
                <RecentContracts history={history} />
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
