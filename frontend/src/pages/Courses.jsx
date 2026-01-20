import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Terminal,
  Cpu,
  BookOpen,
  Clock,
  CheckCircle,
  ChevronRight,
  Play,
  HardDrive,
  FileText,
  Code,
  Network,
  Settings,
  Loader,
} from "lucide-react";
import { courses } from "../data/courseData";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config";

function Courses() {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(`${API_URL}/api/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setProgress(data.completed_lessons || []);
        }
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  // Calculate course progress
  const getCourseProgress = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return { completed: 0, total: 0, percent: 0 };

    const total = course.lessons.length;
    const completed = course.lessons.filter((lesson) =>
      progress.includes(`${courseId}:${lesson.id}`),
    ).length;

    return {
      completed,
      total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const iconMap = {
    Terminal: Terminal,
    Cpu: Cpu,
    BookOpen: BookOpen,
    HardDrive: HardDrive,
    FileText: FileText,
    Code: Code,
    Network: Network,
    Settings: Settings,
  };

  // Loading skeleton component
  const CourseSkeleton = () => (
    <div className="bg-[#12121a]/50 border border-white/5 rounded-2xl p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-white/10" />
        <div className="flex-1">
          <div className="h-6 bg-white/10 rounded w-3/4 mb-3" />
          <div className="h-4 bg-white/5 rounded w-full mb-2" />
          <div className="h-4 bg-white/5 rounded w-2/3 mb-4" />
          <div className="flex gap-4">
            <div className="h-4 bg-white/5 rounded w-20" />
            <div className="h-4 bg-white/5 rounded w-20" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
                <Terminal size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg hidden sm:block">OS Lab</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                to="/lab"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <Play size={16} />
                <span className="text-sm">Lab</span>
              </Link>
              {user ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <span className="text-sm text-slate-300">
                    {user.username}
                  </span>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-24 pb-12 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
            <BookOpen size={14} />
            Learn by Doing
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            OS Learning{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Courses
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {courses.length} comprehensive courses from basics to advanced.
            Practice directly in the terminal.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CourseSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {courses.map((course) => {
                const Icon = iconMap[course.icon] || BookOpen;
                const prog = getCourseProgress(course.id);

                return (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="group relative bg-[#12121a]/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-white/10 hover:bg-[#12121a]/80 transition-all duration-300"
                  >
                    {/* Progress indicator */}
                    {user && prog.completed > 0 && (
                      <div className="absolute top-4 right-4">
                        <div
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            prog.percent === 100
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {prog.percent === 100 ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle size={12} /> Complete
                            </span>
                          ) : (
                            `${prog.percent}%`
                          )}
                        </div>
                      </div>
                    )}

                    {/* Premium Badge */}
                    {course.premium && (
                      <div className="absolute top-4 left-4">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                          ⭐ ADVANCED
                        </span>
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          course.color === "emerald"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : course.color === "blue"
                              ? "bg-blue-500/10 text-blue-400"
                              : course.color === "purple"
                                ? "bg-purple-500/10 text-purple-400"
                                : course.color === "red"
                                  ? "bg-red-500/10 text-red-400"
                                  : course.color === "orange"
                                    ? "bg-orange-500/10 text-orange-400"
                                    : course.color === "cyan"
                                      ? "bg-cyan-500/10 text-cyan-400"
                                      : course.color === "pink"
                                        ? "bg-pink-500/10 text-pink-400"
                                        : "bg-purple-500/10 text-purple-400"
                        }`}
                      >
                        <Icon size={28} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-slate-400 mb-4">
                          {course.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <BookOpen size={14} />
                            {course.lessons.length} lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {course.duration}
                          </span>
                        </div>

                        {/* Progress bar */}
                        {user && prog.total > 0 && (
                          <div className="mt-4">
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  prog.percent === 100
                                    ? "bg-emerald-500"
                                    : "bg-blue-500"
                                }`}
                                style={{ width: `${prog.percent}%` }}
                              />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                              {prog.completed} of {prog.total} lessons completed
                            </p>
                          </div>
                        )}
                      </div>

                      <ChevronRight
                        size={20}
                        className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Not logged in message */}
          {!user && !loading && (
            <div className="mt-8 p-6 bg-[#12121a]/50 border border-white/5 rounded-xl text-center">
              <p className="text-slate-400 mb-4">
                Sign in to track your learning progress
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
              >
                Login to Track Progress
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Courses;
