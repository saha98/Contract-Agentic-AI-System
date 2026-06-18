import {
  FiAlertTriangle,
  FiBarChart2,
  FiClock,
  FiFileText,
  FiGrid,
  FiSettings,
  FiShield,
  FiUsers
} from "react-icons/fi";

function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: <FiGrid />
    },
    {
      name: "Contracts",
      icon: <FiFileText />
    },
    {
      name: "Risk Center",
      icon: <FiAlertTriangle />
    },
    {
      name: "Departments",
      icon: <FiUsers />
    },
    {
      name: "Audit",
      icon: <FiShield />
    },
    {
      name: "Analytics",
      icon: <FiBarChart2 />
    },
    {
      name: "History",
      icon: <FiClock />
    },
    {
      name: "Settings",
      icon: <FiSettings />
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo-row">
          <div className="sidebar-logo">EY</div>
          <div>
            <h1 className="sidebar-title">AI Contract Intelligence</h1>
            <p className="sidebar-subtitle">Executive command center</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`sidebar-link ${activePage === item.name ? "active" : ""}`}
            type="button"
            onClick={() => setActivePage(item.name)}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-footer-label">Environment</p>
        <p className="sidebar-footer-value">Enterprise governance</p>
      </div>
    </aside>
  );
}

export default Sidebar;
