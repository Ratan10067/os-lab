import { Link, useLocation } from "react-router-dom";
import { Terminal, BookOpen, LogIn, Github } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const isLabPage = location.pathname.startsWith("/lab");

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-logo">
          <Terminal size={24} />
          <span>OS Lab</span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/lab"
            className={`navbar-link ${isLabPage ? "active" : ""}`}
          >
            <BookOpen
              size={18}
              style={{ marginRight: "6px", verticalAlign: "middle" }}
            />
            Labs
          </Link>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-link"
          >
            <Github
              size={18}
              style={{ marginRight: "6px", verticalAlign: "middle" }}
            />
            GitHub
          </a>

          <Link to="/login" className="btn btn-secondary">
            <LogIn size={18} />
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
