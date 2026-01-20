import { useRef, useCallback, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  RefreshCw,
  Maximize2,
  Info,
  Wifi,
  WifiOff,
  Terminal as TerminalIcon,
  LogOut,
  User,
  ChevronRight,
  Loader,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar, { labs } from "../components/Sidebar";
import Terminal from "../components/Terminal";
import useWebSocket from "../hooks/useWebSocket";
import { useAuth } from "../context/AuthContext";
import { WS_URL } from "../config";

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
  const [retryCount, setRetryCount] = useState(0);
  const [hasConnectedOnce, setHasConnectedOnce] = useState(false);
  const { user, logout } = useAuth();

  const activeLab = labId || "shell-basics";
  const currentLabInfo =
    labInstructions[activeLab] || labInstructions["shell-basics"];

  // WebSocket connection with token
  const token = localStorage.getItem("auth_token");
  const wsUrl = token
    ? `${WS_URL}?session=${sessionId}&token=${token}`
    : `${WS_URL}?session=${sessionId}`;

  // Use a ref to prevent reconnection loop when url changes slightly
  const wsUrlRef = useRef(wsUrl);
  if (token && !wsUrlRef.current.includes("token")) {
    wsUrlRef.current = `${WS_URL}?session=${sessionId}&token=${token}`;
  }

  const { isConnected, error, sendMessage, setMessageHandler, reconnect } =
    useWebSocket(wsUrlRef.current);

  // Handle incoming data from server - set up in useEffect
  useEffect(() => {
    setMessageHandler((data) => {
      if (terminalRef.current) {
        terminalRef.current.write(data);
      }
    });
  }, [setMessageHandler]);

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
    setRetryCount((prev) => prev + 1);
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
  };

  // Listen for fullscreen changes (e.g., ESC key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Fit terminal after a short delay
      setTimeout(() => {
        terminalRef.current?.fit();
      }, 100);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Track when first connected
  useEffect(() => {
    if (isConnected && !hasConnectedOnce) {
      setHasConnectedOnce(true);
    }
  }, [isConnected, hasConnectedOnce]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Top Navigation Bar */}
      <nav className="h-14 bg-[#12121a]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <TerminalIcon size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg hidden sm:block">OS Lab</span>
        </Link>

        {/* Connection Status */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              isConnected
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span className="hidden sm:inline">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <User size={14} className="text-blue-400" />
                <span className="text-sm text-slate-300">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden lg:block w-64 bg-[#0d0d14] border-r border-white/5 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Labs
            </h2>
            <div className="space-y-1">
              {Object.entries(labInstructions).map(([id, lab]) => (
                <button
                  key={id}
                  onClick={() => handleSelectLab(id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                    activeLab === id
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{lab.title}</span>
                    {activeLab === id && <ChevronRight size={14} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Lab Header */}
          <header className="h-12 bg-[#0d0d14]/50 border-b border-white/5 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-medium text-white">
                {currentLabInfo.title}
              </h1>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                {currentLabInfo.description}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                onClick={handleRefresh}
                title="Reconnect session"
              >
                <RefreshCw
                  size={16}
                  className={!isConnected ? "animate-spin" : ""}
                />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </header>

          {/* Terminal Area */}
          <div className="flex-1 flex relative overflow-hidden">
            {/* Terminal Container */}
            <div
              ref={terminalContainerRef}
              className="flex-1 min-w-0 bg-[#0a0a0f] relative"
            >
              {/* Connection Overlay */}
              {!isConnected && (
                <div className="absolute inset-0 bg-[#0a0a0f]/95 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center p-8 max-w-md">
                    {!hasConnectedOnce ? (
                      // Initial connecting state
                      <>
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <Loader
                            size={28}
                            className="text-emerald-400 animate-spin"
                          />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">
                          Connecting to Terminal
                        </h2>
                        <p className="text-slate-400 text-sm mb-4">
                          Setting up your secure sandbox environment...
                        </p>
                        <div className="flex items-center justify-center gap-1.5">
                          <div
                            className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </>
                    ) : (
                      // Disconnected state (was connected before)
                      <>
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                          <WifiOff size={28} className="text-red-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">
                          Connection Lost
                        </h2>
                        <p className="text-slate-400 text-sm mb-6">
                          {error ||
                            "Unable to connect to the terminal server. Please check your connection and try again."}
                        </p>
                        <button
                          onClick={handleRefresh}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors"
                        >
                          <RefreshCw size={16} />
                          Retry Connection
                        </button>
                        <p className="text-xs text-slate-500 mt-4">
                          Retry attempts: {retryCount}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Terminal */}
              <div className="h-full p-2">
                <Terminal
                  ref={terminalRef}
                  onData={handleTerminalData}
                  onResize={handleTerminalResize}
                />
              </div>
            </div>

            {/* Instructions Panel - Hidden on smaller screens */}
            <aside className="hidden xl:flex flex-col w-80 flex-shrink-0 bg-[#0d0d14] border-l border-white/5 overflow-y-auto p-4">
              <h3 className="text-sm font-semibold text-white mb-4">
                {currentLabInfo.title}
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                {currentLabInfo.description}
              </p>

              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Try These Steps
              </h4>
              <ul className="space-y-3">
                {currentLabInfo.steps.map((step, index) => (
                  <li key={index} className="text-sm text-slate-400 flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>
                      {step.split("`").map((part, i) =>
                        i % 2 === 1 ? (
                          <code
                            key={i}
                            className="px-1.5 py-0.5 bg-white/5 rounded text-blue-300 text-xs font-mono"
                          >
                            {part}
                          </code>
                        ) : (
                          part
                        ),
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-xs font-semibold text-slate-400 mb-3">
                  Quick Commands
                </h4>
                <div className="flex flex-wrap gap-2">
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
                    <code
                      key={cmd}
                      className="px-2 py-1 bg-[#0a0a0f] rounded text-xs text-slate-300 font-mono border border-white/5"
                    >
                      {cmd}
                    </code>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Lab;
