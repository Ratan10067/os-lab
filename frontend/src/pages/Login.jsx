import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Terminal,
  Lock,
  User,
  ArrowRight,
  Loader,
  Github,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get the redirect path from location state, or default to /lab
  const from = location.state?.from?.pathname || "/lab";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const success = await login(formData.username, formData.password);

    setIsLoading(false);

    if (success) {
      navigate(from, { replace: true });
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] relative flex items-center justify-center p-4 overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* --- Dynamic Background --- */}
      <div className="absolute inset-0 w-full h-full">
        {/* Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        {/* Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[100px] animate-pulse delay-700" />
      </div>

      {/* --- Main Card --- */}
      <div className="w-full max-w-md relative z-10">
        {/* Floating Decoration Icon */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-emerald-500/20 blur-2xl rounded-full pointer-events-none" />

        <div className="backdrop-blur-2xl bg-[#12121a]/80 border border-white/10 rounded-3xl shadow-2xl p-8 overflow-hidden relative group hover:border-white/20 transition-colors duration-500">
          {/* Top Gradient Border Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />

          {/* Header */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 mb-6 border border-white/5 shadow-inner ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-500">
              <Terminal
                size={32}
                className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
              />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-slate-400 text-sm">
              Authenticate to access the OS Lab environment
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                Username
              </label>
              <div className="relative group/input">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors duration-300"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full bg-[#0a0a0f]/60 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300"
                  placeholder="Enter username"
                  required
                  autoComplete="off"
                  minLength={3}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative group/input">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors duration-300"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-[#0a0a0f]/60 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed group/btn"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    Access Terminal
                    <ArrowRight
                      size={18}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </div>

              {/* Shine Effect */}
              {!isLoading && (
                <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center space-y-6">
            <p className="text-slate-400 text-sm">
              New to the lab?
              <Link
                to="/signup"
                className="ml-2 text-emerald-400 font-medium hover:text-emerald-300 transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-emerald-400 hover:after:w-full after:transition-all after:duration-300"
              >
                Create Account
              </Link>
            </p>

            {/* Github Link */}
            <div className="pt-6 border-t border-white/5">
              <a
                href="https://github.com/Ratan10067/os-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-xs text-slate-400 hover:text-white transition-all duration-300"
              >
                <Github size={14} />
                <span>Open Source / OS-Lab</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
