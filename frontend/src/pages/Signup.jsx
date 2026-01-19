import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  User,
  ArrowRight,
  Loader,
  Github,
  Eye,
  EyeOff,
  Cpu,
  Mail,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { signup, error: authError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Combine local validation errors with auth errors
  const error = localError || authError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate terms accepted
    if (!agreedToTerms) {
      setLocalError("Please accept the terms and conditions");
      setIsLoading(false);
      return;
    }

    const success = await signup(
      formData.username,
      formData.email,
      formData.password,
    );

    setIsLoading(false);

    if (success) {
      navigate("/lab");
    }
    // Error will be shown from authError
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] relative flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden font-sans selection:bg-blue-500/30">
      {/* --- Dynamic Background --- */}
      <div className="absolute inset-0 w-full h-full">
        {/* Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        {/* Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[100px] animate-pulse delay-700" />
      </div>

      {/* --- Main Card --- */}
      <div className="w-full max-w-md relative z-10">
        {/* Floating Decoration Icon */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-blue-500/20 blur-2xl rounded-full pointer-events-none" />

        <div className="backdrop-blur-2xl bg-[#12121a]/80 border border-white/10 rounded-3xl shadow-2xl p-8 overflow-hidden relative group hover:border-white/20 transition-colors duration-500">
          {/* Top Gradient Border Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />

          {/* Header */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 mb-6 border border-white/5 shadow-inner ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-500">
              <Cpu
                size={32}
                className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]"
              />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Create Account
            </h1>
            <p className="text-slate-400 text-sm">
              Initialize a new user instance to begin your journey
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                Username
              </label>
              <div className="relative group/input">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-400 transition-colors duration-300"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full bg-[#0a0a0f]/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all duration-300"
                  placeholder="Choose a username"
                  required
                  autoComplete="off"
                  minLength={3}
                  pattern="^[a-zA-Z0-9_]+$"
                  title="Username can only contain letters, numbers, and underscores"
                />
              </div>
              <p className="text-xs text-slate-500 ml-1">
                Only letters, numbers, and underscores allowed
              </p>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                Email
              </label>
              <div className="relative group/input">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-400 transition-colors duration-300"
                  size={18}
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-[#0a0a0f]/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all duration-300"
                  placeholder="Enter your email"
                  required
                  autoComplete="off"
                />
              </div>
              <p className="text-xs text-slate-500 ml-1">
                We'll never share your email with anyone
              </p>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative group/input">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-400 transition-colors duration-300"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-[#0a0a0f]/60 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all duration-300"
                  placeholder="Create a password"
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

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                Confirm Password
              </label>
              <div className="relative group/input">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-400 transition-colors duration-300"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full bg-[#0a0a0f]/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all duration-300"
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                />
              </div>
            </div>
            {/* Terms & Conditions */}
            <div className="space-y-3 mt-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-[#0a0a0f] text-blue-500 focus:ring-blue-500/20 focus:ring-offset-0"
                />
                <label htmlFor="terms" className="text-sm text-slate-400">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(!showTerms)}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Terms & Conditions
                  </button>
                </label>
              </div>

              {/* Terms Content */}
              {showTerms && (
                <div className="p-4 bg-[#0a0a0f]/60 border border-white/10 rounded-xl text-xs text-slate-400 space-y-2">
                  <p>By creating an account, you agree to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      Your files are stored securely in isolated containers
                    </li>
                    <li>
                      All data is automatically deleted after{" "}
                      <strong className="text-white">30 days</strong> of
                      inactivity
                    </li>
                    <li>We do not share your information with third parties</li>
                    <li>Use this service for educational purposes only</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed group/btn"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    Create Account
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
              Already have credentials?
              <Link
                to="/login"
                className="ml-2 text-blue-400 font-medium hover:text-blue-300 transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-blue-400 hover:after:w-full after:transition-all after:duration-300"
              >
                Log In
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

export default Signup;
