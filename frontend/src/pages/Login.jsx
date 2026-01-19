import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Terminal, ArrowLeft, User, Lock } from "lucide-react";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simple demo login - in production, this would call your auth API
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (formData.username && formData.password) {
        // Store session (demo only)
        localStorage.setItem(
          "os-lab-user",
          JSON.stringify({
            username: formData.username,
            loggedInAt: new Date().toISOString(),
          }),
        );
        navigate("/lab");
      } else {
        setError("Please enter username and password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="card login-card">
          <div className="login-title">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <Terminal size={28} style={{ color: "var(--accent-green)" }} />
            </div>
            <h2>Welcome Back</h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                marginTop: "0.5rem",
              }}
            >
              Sign in to access your OS Lab session
            </p>
          </div>

          {error && (
            <div
              style={{
                padding: "0.75rem",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "var(--radius-md)",
                color: "var(--accent-red)",
                fontSize: "0.9rem",
                marginBottom: "1rem",
              }}
            >
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username</label>
              <div style={{ position: "relative" }}>
                <User
                  size={18}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="input"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  style={{ paddingLeft: "40px" }}
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={18}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="input"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ paddingLeft: "40px" }}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                marginBottom: "1rem",
              }}
            >
              Don't have an account? Use any credentials for demo.
            </p>
            <Link
              to="/lab"
              className="btn btn-ghost"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <ArrowLeft size={16} />
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
