import { useState } from "react";

function ResultTabs() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      title: "Executive Overview"
    },
    {
      id: "risks",
      label: "Risks",
      title: "Risk Analysis"
    },
    {
      id: "agents",
      label: "Agents",
      title: "Agent Monitor"
    },
    {
      id: "insights",
      label: "Insights",
      title: "Executive Insights"
    },
    {
      id: "audit",
      label: "Audit",
      title: "Audit Trail"
    }
  ];

  const active = tabs.find((tab) => tab.id === activeTab);

  return (
    <section className="tool-card">
      <div className="tab-list" role="tablist" aria-label="Result sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="section-card tab-panel">
        <h3 className="card-title">{active.title}</h3>
      </div>
    </section>
  );
}

export default ResultTabs;
