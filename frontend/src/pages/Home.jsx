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
  ChevronRight,
  Clock,
  Users,
  Code2,
} from "lucide-react";

function Home() {
  const features = [
    {
      icon: Terminal,
      title: "Real Linux Shell",
      description:
        "Access a fully functional Linux shell. Execute real commands, not simulations.",
      color: "emerald",
    },
    {
      icon: Shield,
      title: "Sandboxed Environment",
      description:
        "Each session runs in an isolated sandbox. Experiment freely without risk.",
      color: "blue",
    },
    {
      icon: BookOpen,
      title: "Guided Labs",
      description:
        "Step-by-step labs covering processes, file systems, scheduling, and more.",
      color: "purple",
    },
    {
      icon: Zap,
      title: "No Setup Required",
      description:
        "Works on any OS. Just open the browser and start learning instantly.",
      color: "amber",
    },
  ];

  const topics = [
    { icon: Cpu, name: "Process Management", color: "emerald" },
    { icon: FolderTree, name: "File Systems", color: "blue" },
    { icon: Network, name: "IPC & Signals", color: "purple" },
    { icon: Clock, name: "CPU Scheduling", color: "amber" },
  ];

  const stats = [
    { value: "100%", label: "Free & Open Source" },
    { value: "24/7", label: "Available Anytime" },
    { value: "0", label: "Installation Needed" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
                <Terminal size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg hidden sm:block">OS Lab</span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Ratan10067/os-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <Github size={18} />
                <span className="text-sm">GitHub</span>
              </a>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Free & Open Source
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Learn{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Operating Systems
                </span>{" "}
                by Doing
              </h1>

              <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0">
                A web-based terminal for practicing OS concepts. No installation
                needed. Run Linux commands, explore processes, and understand
                system internals in a safe sandbox.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/lab"
                  className="group flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
                >
                  <Play size={20} />
                  Start Lab
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <a
                  href="https://github.com/Ratan10067/os-lab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all"
                >
                  <Github size={20} />
                  View Source
                </a>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-8 mt-10">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-2xl" />
              <div className="relative bg-[#0d0d14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#12121a] border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-slate-500">
                    user@oslab:~
                  </span>
                </div>

                {/* Terminal Body */}
                <div className="p-4 font-mono text-sm space-y-2">
                  <div className="flex gap-2">
                    <span className="text-emerald-400">~$</span>
                    <span className="text-slate-300">ps aux | head -4</span>
                  </div>
                  <div className="text-slate-500 text-xs">
                    USER PID %CPU %MEM VSZ RSS TTY STAT TIME COMMAND
                  </div>
                  <div className="text-slate-500 text-xs">
                    root 1 0.0 0.1 8536 4200 ? Ss 0:01 /sbin/init
                  </div>
                  <div className="text-slate-500 text-xs">
                    user 23 0.0 0.0 6432 1720 pts/0 S 0:00 bash
                  </div>

                  <div className="flex gap-2 mt-4">
                    <span className="text-emerald-400">~$</span>
                    <span className="text-slate-300">
                      cat /proc/cpuinfo | grep model
                    </span>
                  </div>
                  <div className="text-slate-500 text-xs">
                    model name : Virtual CPU @ 2.0GHz
                  </div>

                  <div className="flex gap-2 mt-4">
                    <span className="text-emerald-400">~$</span>
                    <span className="text-slate-300">free -h</span>
                  </div>
                  <div className="text-slate-500 text-xs">
                    Mem: 512Mi 89Mi 320Mi 1Mi 102Mi 410Mi
                  </div>

                  <div className="flex gap-2 mt-4">
                    <span className="text-emerald-400">~$</span>
                    <span className="w-2 h-4 bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Use OS Lab?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Everything you need to learn operating system concepts hands-on,
              without the complexity of setting up a local environment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-6 bg-[#12121a]/50 backdrop-blur-sm border border-white/5 rounded-2xl hover:border-white/10 hover:bg-[#12121a]/80 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    feature.color === "emerald"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : feature.color === "blue"
                        ? "bg-blue-500/10 text-blue-400"
                        : feature.color === "purple"
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-20 sm:py-32 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What You'll Learn
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Master core operating system concepts through practical exercises
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {topics.map((topic, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 bg-[#12121a]/50 border border-white/5 rounded-xl hover:border-white/10 transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    topic.color === "emerald"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : topic.color === "blue"
                        ? "bg-blue-500/10 text-blue-400"
                        : topic.color === "purple"
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  <topic.icon size={20} />
                </div>
                <span className="text-sm font-medium">{topic.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Start?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Jump into the terminal and begin your OS learning journey today.
            It's completely free.
          </p>
          <Link
            to="/lab"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
          >
            <Terminal size={20} />
            Open Terminal
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Terminal size={18} />
              <span>OS Lab</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a
                href="https://github.com/Ratan10067/os-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
              <Link to="/login" className="hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/signup" className="hover:text-white transition-colors">
                Sign Up
              </Link>
            </div>
            <p className="text-sm text-slate-600">
              Built for learning. Open source.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
