import { Terminal, Loader } from "lucide-react";

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#0a0a0f] z-[100] flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] animate-pulse" />
      </div>

      {/* Loading Content */}
      <div className="relative text-center">
        {/* Logo */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-pulse">
          <Terminal size={40} className="text-white" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-2">OS Lab</h1>
        <p className="text-slate-500 text-sm mb-6">Loading environment...</p>

        {/* Spinner */}
        <div className="flex items-center justify-center gap-2 text-emerald-400">
          <Loader className="animate-spin" size={20} />
          <span className="text-sm">Connecting</span>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
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
      </div>
    </div>
  );
}

export default LoadingScreen;
