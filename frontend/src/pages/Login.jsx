import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Terminal, Lock, User, ArrowRight, Loader, Github } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const action = isLogin ? login : signup;
    const success = await action(formData.username, formData.password);

    setIsLoading(false);

    if (success) {
      navigate("/lab");
    } else {
      setError(
        isLogin ? "Invalid username or password" : "Username already exists",
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent-green/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent-blue/10 blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-green/20 to-accent-blue/20 mb-6 border border-white/5 shadow-inner group">
            <Terminal
              size={32}
              className="text-accent-green group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            {isLogin ? "Welcome Back" : "Join the Lab"}
          </h1>
          <p className="text-text-secondary text-sm">
            {isLogin
              ? "Enter your credentials to access your workspace"
              : "Create an account to start your OS journey"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-center animate-fade-in">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider ml-1">
              Username
            </label>
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-green transition-colors duration-300"
                size={18}
              />
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full bg-[#12121a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-text-muted focus:outline-none focus:border-accent-green/50 focus:ring-1 focus:ring-accent-green/50 transition-all duration-300"
                placeholder="Enter your username"
                required
                minLength={3}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider ml-1">
              Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-green transition-colors duration-300"
                size={18}
              />
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-[#12121a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-text-muted focus:outline-none focus:border-accent-green/50 focus:ring-1 focus:ring-accent-green/50 transition-all duration-300"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-accent-green to-[#16a34a] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-accent-green/20 hover:shadow-accent-green/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <>
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-text-secondary text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setFormData({ username: "", password: "" });
              }}
              className="ml-2 text-accent-green font-medium hover:text-accent-green/80 transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Github Link */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <a
            href="https://github.com/Ratan10067/os-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-white transition-colors opacity-60 hover:opacity-100"
          >
            <Github size={14} />
            <span>Open Source Project</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
