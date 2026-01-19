import { Link } from "react-router-dom";
import { Terminal, Github, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <Terminal className="brand-icon" size={24} />
          <span className="brand-text">OS Lab</span>
        </Link>

        <div className="navbar-actions">
          <a
            href="https://github.com/Ratan10067/os-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-link"
          >
            <Github size={20} />
            <span>GitHub</span>
          </a>

          {user ? (
            <div
              className="user-menu"
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <span
                className="user-name"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                <User size={18} />
                {user.username}
              </span>
              <button
                onClick={logout}
                className="btn btn-secondary btn-sm"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
