import { useRef, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RefreshCw, Maximize2, Info } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar, { labs } from "../components/Sidebar";
import Terminal from "../components/Terminal";
import useWebSocket from "../hooks/useWebSocket";

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
    commands: ["pwd", "ls", "cd", "cat", "echo", "mkdir", "rm", "cp", "mv"],
  },
  processes: {
    title: "Process Management",
    description: "Understand how processes work in Linux.",
    steps: [
      "Run `ps aux` to see all running processes",
      "Use `top` or `htop` for real-time process monitoring",
      "Start a background process with `sleep 100 &`",
      "Find process ID with `pgrep sleep`",
      "Terminate a process with `kill <PID>`",
    ],
    commands: [
      "ps",
      "top",
      "htop",
      "kill",
      "pgrep",
      "jobs",
      "fg",
      "bg",
      "nohup",
    ],
  },
  filesystem: {
    title: "File System",
    description: "Explore the Linux filesystem structure.",
    steps: [
      "Navigate to root with `cd /`",
      "Explore `/proc` - the virtual filesystem for processes",
      "Check `/etc` for system configuration files",
      "Use `df -h` to see disk usage",
      'Find files with `find / -name "*.conf"`',
    ],
    commands: ["ls", "cd", "find", "df", "du", "mount", "stat", "file"],
  },
  scheduling: {
    title: "CPU Scheduling",
    description: "Learn about process priority and scheduling.",
    steps: [
      "View process priorities with `ps -eo pid,ni,comm`",
      "Start a low-priority process with `nice -n 10 command`",
      "Change priority with `renice`",
      "Observe scheduling with `top` (press 1 for CPU details)",
    ],
    commands: ["nice", "renice", "ps", "top", "time"],
  },
  memory: {
    title: "Memory Management",
    description: "Understand memory usage and virtual memory.",
    steps: [
      "Check memory usage with `free -h`",
      "View detailed memory info in `/proc/meminfo`",
      "See per-process memory with `ps aux --sort=-%mem`",
      "Observe memory mapping with `cat /proc/self/maps`",
    ],
    commands: ["free", "vmstat", "cat /proc/meminfo", "ps", "pmap"],
  },
  ipc: {
    title: "IPC & Signals",
    description: "Learn inter-process communication and signals.",
    steps: [
      "Send a signal with `kill -SIGTERM <PID>`",
      "List all signals with `kill -l`",
      "Create a pipe: `ls | grep txt`",
      "Use named pipes with `mkfifo`",
    ],
    commands: ["kill", "trap", "mkfifo", "ipcs", "ipcrm"],
  },
  permissions: {
    title: "Permissions & Security",
    description: "Understand file permissions and security.",
    steps: [
      "View permissions with `ls -la`",
      "Change permissions with `chmod 755 file`",
      "Understand owner/group with `chown`",
      "Check your user/groups with `id`",
    ],
    commands: ["chmod", "chown", "chgrp", "id", "whoami", "groups"],
  },
  disk: {
    title: "Disk Management",
    description: "Learn disk and storage management.",
    steps: [
      "Check disk space with `df -h`",
      "Find large files with `du -sh *`",
      "View block devices with `lsblk`",
      "Check disk I/O with `iostat`",
    ],
    commands: ["df", "du", "lsblk", "fdisk", "mount", "umount"],
  },
};

// Get backend URL from environment or use default
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "ws://localhost:8000/ws";

function Lab() {
  const { labId } = useParams();
  const navigate = useNavigate();
  const terminalRef = useRef(null);
  const [sessionId] = useState(() => crypto.randomUUID());

  const activeLab = labId || "shell-basics";
  const currentLabInfo =
    labInstructions[activeLab] || labInstructions["shell-basics"];

  // WebSocket connection
  const { isConnected, error, sendMessage, setMessageHandler, reconnect } =
    useWebSocket(`${BACKEND_URL}?session=${sessionId}`);

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

  return (
    <>
      <Navbar />
      <div className="lab-page">
        <Sidebar activeLab={activeLab} onSelectLab={handleSelectLab} />

        <main className="lab-main">
          <header className="lab-header">
            <h2 className="lab-header-title">{currentLabInfo.title}</h2>
            <div className="lab-header-status">
              <div
                className="dot"
                style={{
                  background: isConnected
                    ? "var(--accent-green)"
                    : "var(--accent-red)",
                }}
              ></div>
              <span>{isConnected ? "Connected" : "Disconnected"}</span>

              <button
                className="btn btn-ghost"
                onClick={handleRefresh}
                title="Refresh session"
              >
                <RefreshCw size={16} />
              </button>

              <button
                className="btn btn-ghost"
                onClick={() => {
                  if (terminalRef.current) {
                    terminalRef.current.fit();
                  }
                }}
                title="Fit terminal"
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
              <button
                className="btn btn-secondary"
                style={{ marginLeft: "auto", padding: "0.25rem 0.75rem" }}
                onClick={reconnect}
              >
                Retry
              </button>
            </div>
          )}

          <div className="lab-content">
            <div className="lab-terminal-container">
              <div className="lab-terminal">
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
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  marginTop: "1.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                Try These Steps:
              </h4>
              <ul>
                {currentLabInfo.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>

              <h4
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  marginTop: "1.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                Useful Commands:
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {currentLabInfo.commands.map((cmd, i) => (
                  <code
                    key={i}
                    style={{
                      display: "inline-block",
                      padding: "0.25rem 0.5rem",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (terminalRef.current) {
                        sendMessage(cmd + "\r");
                      }
                    }}
                    title="Click to run"
                  >
                    {cmd}
                  </code>
                ))}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}

export default Lab;
