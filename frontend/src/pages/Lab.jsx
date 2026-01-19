import { useRef, useCallback, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RefreshCw, Maximize2, Info } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar, { labs } from "../components/Sidebar";
import Terminal from "../components/Terminal";
import useWebSocket from "../hooks/useWebSocket";
import { useAuth } from "../context/AuthContext";
import { BACKEND_URL } from "../config";

// Lab instructions content
const labInstructions = {
  "shell-basics": {
    title: "Shell Basics",
    description: "Learn the fundamentals of using a Linux shell.",
    steps: [
      "Try running `pwd` to see your current directory",
      "Use `ls -la` to list files with details",
      'Create a file with `echo "hello" > test.txt`',
      "View file contents with `cat test.txt`",
      "Navigate directories with `cd` command",
    ],
  },
  "process-management": {
    title: "Process Management",
    description: "Understand how processes working in Linux.",
    steps: [
      "Run `ps aux` to view running processes",
      "Start a background process with `sleep 100 &`",
      "View jobs with `jobs` command",
      "Kill a process using `kill <pid>`",
      "Monitor resources with `top` or `htop`",
    ],
  },
  "file-system": {
    title: "File System",
    description: "Explore Linux file permissions and structure.",
    steps: [
      "Check file permissions with `ls -l`",
      "Modify permissions with `chmod 777 test.txt`",
      "Create a directory with `mkdir mydir`",
      "Create a deep structure with `mkdir -p a/b/c`",
      "View directory tree with `tree`",
    ],
  },
  "cpu-scheduling": {
    title: "CPU Scheduling",
    description: "Learn about process priority and scheduling.",
    steps: [
      "Run `nice -n 10 sleep 100 &`",
      "Check priority with `ps -l`",
      "Change priority with `renice`",
      "View system load with `uptime`",
      "Compare process states",
    ],
  },
};

function Lab() {
  const { labId } = useParams();
  const navigate = useNavigate();
  const terminalRef = useRef(null);
  const terminalContainerRef = useRef(null);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { user } = useAuth();

  const activeLab = labId || "shell-basics";
  const currentLabInfo =
    labInstructions[activeLab] || labInstructions["shell-basics"];

  // WebSocket connection with token
  const token = localStorage.getItem("auth_token");
  const wsUrl = token
    ? `${BACKEND_URL}?session=${sessionId}&token=${token}`
    : `${BACKEND_URL}?session=${sessionId}`;

  // Use a ref to prevent reconnection loop when url changes slightly
  const wsUrlRef = useRef(wsUrl);
  if (token && !wsUrlRef.current.includes("token")) {
    wsUrlRef.current = `${BACKEND_URL}?session=${sessionId}&token=${token}`;
  }

  const { isConnected, error, sendMessage, setMessageHandler, reconnect } =
    useWebSocket(wsUrlRef.current);

  // Handle incoming data from server
  setMessageHandler(
    useCallback((data) => {
      if (terminalRef.current) {
        terminalRef.current.write(data);
      }
    }, []),
  );

  // Handle user input
  const handleTerminalData = useCallback(
    (data) => {
      sendMessage(data);
    },
    [sendMessage],
  );

  // Handle terminal resize
  const handleTerminalResize = useCallback(
    ({ cols, rows }) => {
      sendMessage(JSON.stringify({ type: "resize", cols, rows }));
    },
    [sendMessage],
  );

  // Handle lab selection
  const handleSelectLab = (newLabId) => {
    navigate(`/lab/${newLabId}`);
  };

  // Handle session refresh
  const handleRefresh = () => {
    if (terminalRef.current) {
      terminalRef.current.clear();
    }
    reconnect();
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      terminalContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
    // Fit terminal after a short delay
    setTimeout(() => {
      terminalRef.current?.fit();
    }, 100);
  };

  return (
    <>
      <Navbar />
      <div className="lab-page">
        <Sidebar activeLab={activeLab} onSelectLab={handleSelectLab} />

        <main className="lab-main">
          <header className="lab-header">
            <div className="lab-status">
              <span
                className={`status-dot ${isConnected ? "connected" : "disconnected"}`}
              ></span>
              <span className="status-text">
                {isConnected
                  ? `Connected${user ? ` (${user.username})` : ""}`
                  : "Disconnected"}
              </span>
            </div>

            <div className="lab-actions">
              <button
                className="btn btn-ghost"
                onClick={handleRefresh}
                title="Refresh session"
              >
                <RefreshCw size={16} />
              </button>

              <button
                className="btn btn-ghost"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </header>

          {error && (
            <div
              style={{
                padding: "0.75rem 1.5rem",
                background: "rgba(239, 68, 68, 0.1)",
                borderBottom: "1px solid rgba(239, 68, 68, 0.2)",
                color: "var(--accent-red)",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Info size={16} />
              {error}
            </div>
          )}

          <div className="lab-content">
            <div className="lab-terminal-container" ref={terminalContainerRef}>
              <div
                className="lab-terminal"
                style={{
                  backgroundColor: isFullscreen ? "#0a0a0f" : undefined,
                }}
              >
                <Terminal
                  ref={terminalRef}
                  onData={handleTerminalData}
                  onResize={handleTerminalResize}
                />
              </div>
            </div>

            <aside className="lab-instructions">
              <h3>{currentLabInfo.title}</h3>
              <p>{currentLabInfo.description}</p>

              <h4
                style={{
                  marginTop: "1.5rem",
                  marginBottom: "1rem",
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Try These Steps:
              </h4>

              <ul
                style={{
                  paddingLeft: "1.25rem",
                  color: "var(--text-secondary)",
                }}
              >
                {currentLabInfo.steps.map((step, index) => (
                  <li key={index} style={{ marginBottom: "0.5rem" }}>
                    {step.split("`").map((part, i) =>
                      i % 2 === 1 ? (
                        <code key={i} className="inline-code">
                          {part}
                        </code>
                      ) : (
                        part
                      ),
                    )}
                  </li>
                ))}
              </ul>

              <div className="instruction-card" style={{ marginTop: "2rem" }}>
                <h4>Useful Commands:</h4>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    marginTop: "0.5rem",
                  }}
                >
                  {[
                    "pwd",
                    "ls",
                    "cd",
                    "cat",
                    "echo",
                    "mkdir",
                    "rm",
                    "cp",
                    "mv",
                  ].map((cmd) => (
                    <code key={cmd} className="cmd-tag">
                      {cmd}
                    </code>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}

export default Lab;
