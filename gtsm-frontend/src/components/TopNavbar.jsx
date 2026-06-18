import { FiBell, FiSearch, FiUser } from "react-icons/fi";

function TopNavbar({ activePage }) {
  return (
    <header className="topnav">
      <div>
        <p className="topnav-page-label">Workspace</p>
        <h2 className="topnav-title">{activePage}</h2>
      </div>

      <div className="topnav-actions">
        <div className="search-shell">
          <FiSearch />
          <input className="search-input" placeholder="Search contracts..." />
        </div>

        <button className="icon-button" type="button" aria-label="Notifications">
          <FiBell />
        </button>

        <div className="user-chip">
          <div className="avatar" aria-hidden="true">
            <FiUser />
          </div>
          <div>
            <div className="user-name">Suvodeep</div>
            <div className="user-role">Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
