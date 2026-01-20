import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  Folder,
  Server,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  HardDrive,
  Clock,
  LogOut,
  Home,
  Search,
  Loader,
  File,
  FolderOpen,
  ArrowUp,
  X,
  FileText,
} from "lucide-react";
import { API_URL } from "../config";

function Admin() {
  const navigate = useNavigate();
  const [passkey, setPasskey] = useState("");
  const [showPasskey, setShowPasskey] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data state
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [folders, setFolders] = useState([]);
  const [systemInfo, setSystemInfo] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // UI state
  const [activeTab, setActiveTab] = useState("stats");
  const [searchQuery, setSearchQuery] = useState("");

  // File browser state
  const [fileBrowserUser, setFileBrowserUser] = useState(null);
  const [fileBrowserPath, setFileBrowserPath] = useState("");
  const [fileBrowserData, setFileBrowserData] = useState(null);
  const [largeFiles, setLargeFiles] = useState(null);
  const [fileViewer, setFileViewer] = useState(null); // { username, path, content, ... }
  const [expandedUser, setExpandedUser] = useState(null);

  // Store passkey in session storage
  const storedPasskey = sessionStorage.getItem("admin_passkey");

  useEffect(() => {
    if (storedPasskey) {
      setPasskey(storedPasskey);
      verifyAccess(storedPasskey);
    }
  }, []);

  const apiCall = async (endpoint, method = "GET", passKeyToUse = passkey) => {
    const response = await fetch(`${API_URL}/admin/portal${endpoint}`, {
      method,
      headers: {
        "X-Admin-Secret": passKeyToUse,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem("admin_passkey");
        throw new Error("Invalid admin passkey");
      }
      const data = await response.json();
      throw new Error(data.detail || "API error");
    }

    return response.json();
  };

  const verifyAccess = async (key = passkey) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiCall("/verify", "GET", key);
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_passkey", key);
      // Load initial data
      loadStats(key);
    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async (key = passkey) => {
    try {
      const data = await apiCall("/stats", "GET", key);
      setStats(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await apiCall("/users");
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFolders = async () => {
    setIsLoading(true);
    try {
      const data = await apiCall("/folders");
      setFolders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSystemInfo = async () => {
    setIsLoading(true);
    try {
      const data = await apiCall("/system");
      setSystemInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserDetails = async (username) => {
    setIsLoading(true);
    try {
      const data = await apiCall(`/user/${username}`);
      setUserDetails(data);
      setSelectedUser(username);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUserFolder = async (username) => {
    if (!confirm(`Delete folder for ${username}? This cannot be undone.`))
      return;

    try {
      await apiCall(`/user/${username}/folder`, "DELETE");
      loadFolders();
      loadStats();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteUser = async (username) => {
    if (
      !confirm(
        `DELETE user "${username}" and all their data? This CANNOT be undone!`,
      )
    )
      return;

    try {
      await apiCall(`/user/${username}`, "DELETE");
      loadUsers();
      loadStats();
      setUserDetails(null);
      setSelectedUser(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // File browser functions
  const browseUserFiles = async (username, path = "") => {
    setIsLoading(true);
    try {
      const encodedPath = encodeURIComponent(path);
      const data = await apiCall(`/user/${username}/files?path=${encodedPath}`);
      setFileBrowserUser(username);
      setFileBrowserPath(path);
      setFileBrowserData(data);
      setActiveTab("files");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async (username, path) => {
    const fileName = path.split("/").pop();
    if (!confirm(`Delete "${fileName}"? This cannot be undone.`)) return;

    try {
      const encodedPath = encodeURIComponent(path);
      await apiCall(`/user/${username}/files?path=${encodedPath}`, "DELETE");
      // Refresh current folder
      browseUserFiles(username, fileBrowserPath);
      loadStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const loadLargeFiles = async (minSizeMb = 1) => {
    setIsLoading(true);
    try {
      const data = await apiCall(`/large-files?min_size_mb=${minSizeMb}`);
      setLargeFiles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const viewFile = async (username, path) => {
    setIsLoading(true);
    try {
      const encodedPath = encodeURIComponent(path);
      const data = await apiCall(
        `/user/${username}/files/view?path=${encodedPath}`,
      );
      setFileViewer({ username, ...data });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_passkey");
    setIsAuthenticated(false);
    setPasskey("");
    setStats(null);
    setUsers([]);
    setFolders([]);
  };

  // Load data when tab changes
  useEffect(() => {
    if (!isAuthenticated) return;

    switch (activeTab) {
      case "stats":
        loadStats();
        break;
      case "users":
        loadUsers();
        break;
      case "folders":
        loadFolders();
        break;
      case "files":
        loadFolders(); // Load folders list for file manager
        break;
      case "system":
        loadSystemInfo();
        break;
    }
  }, [activeTab, isAuthenticated]);

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <Shield size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-slate-400">
              Enter your admin passkey to access the dashboard
            </p>
          </div>

          <div className="bg-[#12121a] rounded-2xl border border-white/10 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Admin Passkey
                </label>
                <div className="relative">
                  <input
                    type={showPasskey ? "text" : "password"}
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && verifyAccess()}
                    placeholder="Enter your secret passkey"
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasskey(!showPasskey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPasskey ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                onClick={() => verifyAccess()}
                disabled={isLoading || !passkey}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    Access Dashboard
                  </>
                )}
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="mt-6 w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <Home size={16} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="h-14 bg-[#12121a]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg">Admin Portal</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => loadStats()}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0d0d14] border-r border-white/5 min-h-[calc(100vh-3.5rem)] p-4">
          <nav className="space-y-1">
            {[
              { id: "stats", icon: Server, label: "Overview" },
              { id: "users", icon: Users, label: "Users" },
              { id: "folders", icon: Folder, label: "Folders" },
              { id: "files", icon: FolderOpen, label: "File Manager" },
              { id: "system", icon: HardDrive, label: "System" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Quick Stats */}
          {stats && (
            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Quick Stats
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Users</span>
                  <span className="text-white font-medium">
                    {stats.total_users}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Folders</span>
                  <span className="text-white font-medium">
                    {stats.total_folders}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Disk Usage</span>
                  <span className="text-white font-medium">
                    {stats.total_disk_usage}
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === "stats" && (
            <div>
              <h2 className="text-xl font-bold mb-6">Dashboard Overview</h2>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Users size={20} className="text-blue-400" />
                    </div>
                    <span className="text-slate-400 text-sm">Total Users</span>
                  </div>
                  <p className="text-3xl font-bold">
                    {stats?.total_users || 0}
                  </p>
                </div>

                <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Folder size={20} className="text-green-400" />
                    </div>
                    <span className="text-slate-400 text-sm">
                      Active Folders
                    </span>
                  </div>
                  <p className="text-3xl font-bold">
                    {stats?.total_folders || 0}
                  </p>
                </div>

                <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <HardDrive size={20} className="text-purple-400" />
                    </div>
                    <span className="text-slate-400 text-sm">Disk Usage</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {stats?.total_disk_usage || "0 B"}
                  </p>
                </div>

                <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <Server size={20} className="text-orange-400" />
                    </div>
                    <span className="text-slate-400 text-sm">
                      Active Sessions
                    </span>
                  </div>
                  <p className="text-3xl font-bold">
                    {stats?.active_sessions || 0}
                  </p>
                </div>
              </div>

              {/* Base Path Info */}
              <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
                <h3 className="text-sm font-medium text-slate-300 mb-2">
                  Users Base Path
                </h3>
                <code className="text-sm text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg">
                  {stats?.users_base_path || "Loading..."}
                </code>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Registered Users</h2>
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-[#12121a] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader size={24} className="animate-spin text-blue-400" />
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="bg-[#12121a] rounded-xl border border-white/10 overflow-hidden"
                    >
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5"
                        onClick={() =>
                          setExpandedUser(
                            expandedUser === user.username
                              ? null
                              : user.username,
                          )
                        }
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                            {user.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-slate-400">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <p
                              className={`text-sm ${user.folder_exists ? "text-green-400" : "text-red-400"}`}
                            >
                              {user.folder_exists ? (
                                <span className="flex items-center gap-1">
                                  <CheckCircle size={14} />
                                  {user.folder_size}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <AlertCircle size={14} /> No folder
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {expandedUser === user.username ? (
                            <ChevronDown size={18} className="text-slate-400" />
                          ) : (
                            <ChevronRight
                              size={18}
                              className="text-slate-400"
                            />
                          )}
                        </div>
                      </div>

                      {/* Expanded details */}
                      {expandedUser === user.username && (
                        <div className="px-4 pb-4 pt-2 border-t border-white/5">
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <span className="text-slate-400">
                                Folder Path:
                              </span>
                              <p className="text-white font-mono text-xs mt-1 break-all">
                                {user.folder_path}
                              </p>
                            </div>
                            <div>
                              <span className="text-slate-400">
                                Last Active:
                              </span>
                              <p className="text-white mt-1">
                                {user.last_active
                                  ? new Date(user.last_active).toLocaleString()
                                  : "Never"}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                loadUserDetails(user.username);
                              }}
                              className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/20 transition-colors"
                            >
                              View Details
                            </button>
                            {user.folder_exists && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteUserFolder(user.username);
                                }}
                                className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg text-sm hover:bg-orange-500/20 transition-colors"
                              >
                                Delete Folder
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteUser(user.username);
                              }}
                              className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      No users found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Folders Tab */}
          {activeTab === "folders" && (
            <div>
              <h2 className="text-xl font-bold mb-6">User Folders on Disk</h2>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader size={24} className="animate-spin text-blue-400" />
                </div>
              ) : (
                <div className="bg-[#12121a] rounded-xl border border-white/10 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">
                          Username
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">
                          Size
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">
                          Files
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">
                          Path
                        </th>
                        <th className="text-right px-4 py-3 text-sm font-medium text-slate-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {folders.map((folder) => (
                        <tr
                          key={folder.folder_path}
                          className="hover:bg-white/5"
                        >
                          <td className="px-4 py-3 font-medium">
                            {folder.username}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {folder.size_human}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {folder.file_count}
                          </td>
                          <td className="px-4 py-3 text-xs font-mono text-slate-400 truncate max-w-xs">
                            {folder.folder_path}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => deleteUserFolder(folder.username)}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {folders.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      No folders found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* System Tab */}
          {activeTab === "system" && (
            <div>
              <h2 className="text-xl font-bold mb-6">System Information</h2>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader size={24} className="animate-spin text-blue-400" />
                </div>
              ) : (
                systemInfo && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
                      <h3 className="text-sm font-medium text-slate-400 mb-3">
                        Environment
                      </h3>
                      <p className="text-lg font-medium">
                        {systemInfo.environment}
                      </p>
                    </div>

                    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
                      <h3 className="text-sm font-medium text-slate-400 mb-3">
                        Python Version
                      </h3>
                      <p className="text-lg font-medium">
                        {systemInfo.python_version}
                      </p>
                    </div>

                    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
                      <h3 className="text-sm font-medium text-slate-400 mb-3">
                        Users Base Path
                      </h3>
                      <code className="text-sm text-blue-400">
                        {systemInfo.users_base_path}
                      </code>
                    </div>

                    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
                      <h3 className="text-sm font-medium text-slate-400 mb-3">
                        Proot Available
                      </h3>
                      <p
                        className={`flex items-center gap-2 ${systemInfo.proot_available ? "text-green-400" : "text-red-400"}`}
                      >
                        {systemInfo.proot_available ? (
                          <>
                            <CheckCircle size={18} /> Yes
                          </>
                        ) : (
                          <>
                            <AlertCircle size={18} /> No
                          </>
                        )}
                      </p>
                    </div>

                    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
                      <h3 className="text-sm font-medium text-slate-400 mb-3">
                        Rootfs Exists
                      </h3>
                      <p
                        className={`flex items-center gap-2 ${systemInfo.rootfs_exists ? "text-green-400" : "text-red-400"}`}
                      >
                        {systemInfo.rootfs_exists ? (
                          <>
                            <CheckCircle size={18} /> Yes
                          </>
                        ) : (
                          <>
                            <AlertCircle size={18} /> No
                          </>
                        )}
                      </p>
                    </div>

                    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
                      <h3 className="text-sm font-medium text-slate-400 mb-3">
                        Disk Space
                      </h3>
                      <p className="text-lg font-medium">
                        {systemInfo.disk_free}{" "}
                        <span className="text-slate-400 text-sm">free</span> /{" "}
                        {systemInfo.disk_total}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* Files Tab - File Manager */}
          {activeTab === "files" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">File Manager</h2>
                <button
                  onClick={() => loadLargeFiles(1)}
                  className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg text-sm hover:bg-orange-500/20 transition-colors"
                >
                  Find Large Files (&gt;1MB)
                </button>
              </div>

              {/* User Folder Selector */}
              {!fileBrowserUser && (
                <div>
                  <p className="text-slate-400 mb-4">
                    Select a user folder to browse:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {folders.map((folder) => (
                      <button
                        key={folder.username}
                        onClick={() => browseUserFiles(folder.username)}
                        className="p-4 bg-[#12121a] rounded-xl border border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-left"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Folder size={20} className="text-blue-400" />
                          <span className="font-medium truncate">
                            {folder.username}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">
                          {folder.size_human}
                        </p>
                        <p className="text-xs text-slate-500">
                          {folder.file_count} files
                        </p>
                      </button>
                    ))}
                  </div>
                  {folders.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      No user folders found. Users need to sign up first.
                    </div>
                  )}
                </div>
              )}

              {/* File Browser */}
              {fileBrowserUser && fileBrowserData && (
                <div>
                  {/* Navigation Header */}
                  <div className="flex items-center gap-4 mb-4 p-3 bg-[#12121a] rounded-lg border border-white/10">
                    <button
                      onClick={() => {
                        setFileBrowserUser(null);
                        setFileBrowserData(null);
                        setFileBrowserPath("");
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="Back to user list"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-blue-400 font-medium">
                        {fileBrowserUser}
                      </span>
                      <span className="text-slate-500">/</span>
                      {fileBrowserPath ? (
                        <>
                          <button
                            onClick={() => browseUserFiles(fileBrowserUser, "")}
                            className="text-slate-400 hover:text-white"
                          >
                            home
                          </button>
                          {fileBrowserPath.split("/").map((segment, i, arr) => (
                            <span key={i} className="flex items-center gap-2">
                              <span className="text-slate-500">/</span>
                              <button
                                onClick={() =>
                                  browseUserFiles(
                                    fileBrowserUser,
                                    arr.slice(0, i + 1).join("/"),
                                  )
                                }
                                className={
                                  i === arr.length - 1
                                    ? "text-white font-medium"
                                    : "text-slate-400 hover:text-white"
                                }
                              >
                                {segment}
                              </button>
                            </span>
                          ))}
                        </>
                      ) : (
                        <span className="text-white font-medium">home</span>
                      )}
                    </div>
                    {fileBrowserPath && (
                      <button
                        onClick={() =>
                          browseUserFiles(
                            fileBrowserUser,
                            fileBrowserData.parent_path || "",
                          )
                        }
                        className="ml-auto p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Go up"
                      >
                        <ArrowUp size={16} />
                      </button>
                    )}
                  </div>

                  {/* File Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                    <span>{fileBrowserData.total_items} items</span>
                    <span>•</span>
                    <span>{fileBrowserData.total_size}</span>
                  </div>

                  {/* File List */}
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader
                        size={24}
                        className="animate-spin text-blue-400"
                      />
                    </div>
                  ) : (
                    <div className="bg-[#12121a] rounded-xl border border-white/10 overflow-hidden">
                      {fileBrowserData.items.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                          Empty folder
                        </div>
                      ) : (
                        <table className="w-full">
                          <thead className="bg-white/5">
                            <tr>
                              <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">
                                Name
                              </th>
                              <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">
                                Size
                              </th>
                              <th className="text-left px-4 py-3 text-sm font-medium text-slate-400 hidden md:table-cell">
                                Modified
                              </th>
                              <th className="text-right px-4 py-3 text-sm font-medium text-slate-400">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {fileBrowserData.items.map((item) => (
                              <tr key={item.path} className="hover:bg-white/5">
                                <td className="px-4 py-3">
                                  {item.type === "directory" ? (
                                    <button
                                      onClick={() =>
                                        browseUserFiles(
                                          fileBrowserUser,
                                          item.path,
                                        )
                                      }
                                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                                    >
                                      <Folder size={16} />
                                      <span>{item.name}</span>
                                    </button>
                                  ) : (
                                    <div className="flex items-center gap-2 text-slate-300">
                                      <File
                                        size={16}
                                        className="text-slate-500"
                                      />
                                      <span>{item.name}</span>
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-slate-400 text-sm">
                                  {item.size_human}
                                </td>
                                <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">
                                  {item.modified
                                    ? new Date(item.modified).toLocaleString()
                                    : "-"}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    {item.type === "file" && (
                                      <button
                                        onClick={() =>
                                          viewFile(fileBrowserUser, item.path)
                                        }
                                        className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                        title="View file"
                                      >
                                        <Eye size={14} />
                                      </button>
                                    )}
                                    <button
                                      onClick={() =>
                                        deleteFile(fileBrowserUser, item.path)
                                      }
                                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Large Files Results */}
              {largeFiles && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">
                      Large Files ({largeFiles.total_found} found,{" "}
                      {largeFiles.total_size})
                    </h3>
                    <button
                      onClick={() => setLargeFiles(null)}
                      className="text-slate-400 hover:text-white text-sm"
                    >
                      Close
                    </button>
                  </div>
                  <div className="bg-[#12121a] rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">
                            User
                          </th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">
                            File
                          </th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">
                            Size
                          </th>
                          <th className="text-right px-4 py-3 text-sm font-medium text-slate-400">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {largeFiles.files.map((file, i) => (
                          <tr key={i} className="hover:bg-white/5">
                            <td className="px-4 py-3 font-medium text-blue-400">
                              {file.username}
                            </td>
                            <td className="px-4 py-3 text-slate-300 font-mono text-sm truncate max-w-xs">
                              {file.path}
                            </td>
                            <td className="px-4 py-3 text-orange-400 font-medium">
                              {file.size_human}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() =>
                                  deleteFile(file.username, file.path)
                                }
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {largeFiles.files.length === 0 && (
                      <div className="text-center py-12 text-slate-400">
                        No large files found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* User Details Drawer */}
        {selectedUser && userDetails && (
          <aside className="w-80 bg-[#0d0d14] border-l border-white/5 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">User Details</h3>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setUserDetails(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* User Info */}
              <div className="bg-white/5 rounded-lg p-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-lg mb-3">
                  {userDetails.user.username[0].toUpperCase()}
                </div>
                <p className="font-medium">{userDetails.user.username}</p>
                <p className="text-sm text-slate-400">
                  {userDetails.user.email}
                </p>
              </div>

              {/* Folder Info */}
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">
                  Folder
                </h4>
                <div className="bg-white/5 rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Exists:</span>
                    <span
                      className={
                        userDetails.folder.exists
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {userDetails.folder.exists ? "Yes" : "No"}
                    </span>
                  </div>
                  {userDetails.folder.exists && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Size:</span>
                        <span>{userDetails.folder.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Files:</span>
                        <span>{userDetails.folder.file_count}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Folder Contents */}
              {userDetails.folder.contents?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">
                    Contents
                  </h4>
                  <div className="bg-white/5 rounded-lg p-2 max-h-48 overflow-y-auto">
                    {userDetails.folder.contents.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-2 py-1.5 text-sm"
                      >
                        <Folder
                          size={14}
                          className={
                            item.type === "directory"
                              ? "text-blue-400"
                              : "text-slate-400"
                          }
                        />
                        <span className="flex-1 truncate">{item.name}</span>
                        {item.size && (
                          <span className="text-xs text-slate-500">
                            {item.size}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress */}
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">
                  Learning Progress
                </h4>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-2xl font-bold">
                    {userDetails.progress.completed_lessons.length}
                  </p>
                  <p className="text-sm text-slate-400">lessons completed</p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                {userDetails.folder.exists && (
                  <button
                    onClick={() => deleteUserFolder(userDetails.user.username)}
                    className="w-full py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg text-sm hover:bg-orange-500/20 transition-colors"
                  >
                    Delete Folder Only
                  </button>
                )}
                <button
                  onClick={() => deleteUser(userDetails.user.username)}
                  className="w-full py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                  Delete User Completely
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* File Viewer Modal */}
      {fileViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#12121a] rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <FileText size={20} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">{fileViewer.filename}</h3>
                  <p className="text-sm text-slate-400">
                    {fileViewer.size} • {fileViewer.lines || 0} lines •{" "}
                    {fileViewer.username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFileViewer(null)}
                className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
              {fileViewer.viewable ? (
                <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap break-all bg-black/30 p-4 rounded-lg overflow-x-auto">
                  {fileViewer.content}
                </pre>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle
                    size={48}
                    className="mx-auto text-orange-400 mb-4"
                  />
                  <p className="text-lg font-medium mb-2">
                    Cannot display file
                  </p>
                  <p className="text-slate-400">{fileViewer.reason}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-white/10">
              <p className="text-sm text-slate-500">Path: {fileViewer.path}</p>
              <button
                onClick={() => setFileViewer(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
