import { Link } from "react-router-dom";
import {
  Terminal,
  Play,
  Shield,
  Cpu,
  FolderTree,
  Network,
  BookOpen,
  Zap,
  Github,
} from "lucide-react";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text animate-slide-up">
            <h1 className="hero-title">
              Learn <span className="text-gradient">Operating Systems</span> by
              Doing
            </h1>
            <p className="hero-subtitle">
              A web-based terminal for practicing OS concepts. No installation
              needed. Run Linux commands, explore processes, and understand
              system internals in a safe, sandboxed environment.
            </p>
            <div className="hero-buttons">
              <Link to="/lab" className="btn btn-primary btn-lg">
                <Play size={20} />
                Start Lab
              </Link>
              <a
                href="https://github.com/Ratan10067/os-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
              >
                <Github size={20} />
                View Source
              </a>
            </div>
          </div>

          <div className="hero-terminal animate-fade-in">
            <div className="hero-terminal-header">
              <div className="hero-terminal-dot red"></div>
              <div className="hero-terminal-dot yellow"></div>
              <div className="hero-terminal-dot green"></div>
            </div>
            <div className="hero-terminal-body">
              <div>
                <span className="prompt">~$</span>{" "}
                <span className="command">ps aux | head -5</span>
              </div>
              <div className="output">
                USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND
              </div>
              <div className="output">
                root 1 0.0 0.1 8536 4200 ? Ss 09:00 0:01 /sbin/init
              </div>
              <div className="output">
                root 23 0.0 0.0 6432 1720 ? S 09:00 0:00 /bin/bash
              </div>
              <div>
                <span className="prompt">~$</span>{" "}
                <span className="command">
                  cat /proc/cpuinfo | grep "model name"
                </span>
              </div>
              <div className="output">model name : Virtual CPU @ 2.0GHz</div>
              <div>
                <span className="prompt">~$</span>{" "}
                <span className="command">free -h</span>
              </div>
              <div className="output">
                {" "}
                total used free shared buff/cache available
              </div>
              <div className="output">
                Mem: 512Mi 89Mi 320Mi 1Mi 102Mi 410Mi
              </div>
              <div>
                <span className="prompt">~$</span>{" "}
                <span
                  className="command"
                  style={{
                    borderRight: "2px solid #22c55e",
                    paddingRight: "4px",
                  }}
                >
                  _
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>Why Use OS Lab?</h2>
            <p
              style={{
                color: "var(--text-secondary)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Everything you need to learn operating system concepts hands-on,
              without the complexity of setting up a local environment.
            </p>
          </div>

          <div className="features-grid">
            <div className="card feature-card card-glow-green">
              <div className="feature-icon green">
                <Terminal size={24} />
              </div>
              <h3 className="feature-title">Real Linux Shell</h3>
              <p className="feature-desc">
                Access a fully functional Linux shell right in your browser.
                Execute real commands, not simulations.
              </p>
            </div>

            <div className="card feature-card card-glow-blue">
              <div className="feature-icon blue">
                <Shield size={24} />
              </div>
              <h3 className="feature-title">Sandboxed Environment</h3>
              <p className="feature-desc">
                Each session runs in an isolated sandbox. Experiment freely
                without risk to your system.
              </p>
            </div>

            <div className="card feature-card card-glow-green">
              <div className="feature-icon purple">
                <BookOpen size={24} />
              </div>
              <h3 className="feature-title">Guided Labs</h3>
              <p className="feature-desc">
                Step-by-step labs covering processes, file systems, scheduling,
                IPC, and more.
              </p>
            </div>

            <div className="card feature-card card-glow-blue">
              <div className="feature-icon orange">
                <Zap size={24} />
              </div>
              <h3 className="feature-title">No Setup Required</h3>
              <p className="feature-desc">
                Works on any OS - Windows, Mac, or Linux. Just open the browser
                and start learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>What You'll Learn</h2>
            <p
              style={{
                color: "var(--text-secondary)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Master core operating system concepts through practical exercises
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            {[
              { icon: Cpu, name: "Process Management", color: "green" },
              { icon: FolderTree, name: "File Systems", color: "blue" },
              { icon: Network, name: "IPC & Signals", color: "purple" },
            ].map((topic, i) => (
              <div
                key={i}
                className="card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                }}
              >
                <div
                  className={`feature-icon ${topic.color}`}
                  style={{ width: "40px", height: "40px", flexShrink: 0 }}
                >
                  <topic.icon size={20} />
                </div>
                <span style={{ fontWeight: 500 }}>{topic.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "4rem 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ marginBottom: "1rem" }}>Ready to Start?</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
            Jump into the terminal and begin your OS learning journey
          </p>
          <Link to="/lab" className="btn btn-primary btn-lg">
            <Terminal size={20} />
            Open Terminal
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "2rem 0",
          borderTop: "1px solid var(--border-color)",
          marginTop: "auto",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--text-secondary)",
            }}
          >
            <Terminal size={18} />
            <span>OS Lab</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Built for learning. Open source.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Home;
