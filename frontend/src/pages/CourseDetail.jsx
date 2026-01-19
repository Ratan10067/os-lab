import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Terminal,
  BookOpen,
  Clock,
  CheckCircle,
  Circle,
  ChevronLeft,
  Play,
} from "lucide-react";
import { getCourseById } from "../data/courseData";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config";

function CourseDetail() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const course = getCourseById(courseId);

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

  const isLessonComplete = (lessonId) => {
    return progress.includes(`${courseId}:${lessonId}`);
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Link to="/courses" className="text-emerald-400 hover:underline">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = course.lessons.filter((l) =>
    isLessonComplete(l.id),
  ).length;
  const progressPercent = Math.round(
    (completedCount / course.lessons.length) * 100,
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                <Terminal size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg hidden sm:block">OS Lab</span>
            </Link>

            <Link
              to="/courses"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">All Courses</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/courses"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Courses
          </Link>

          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm mb-4 ${
              course.color === "emerald"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-blue-500/10 text-blue-400"
            }`}
          >
            <BookOpen size={14} />
            {course.lessons.length} Lessons
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {course.title}
          </h1>
          <p className="text-lg text-slate-400 mb-6">{course.description}</p>

          {/* Overall Progress */}
          {user && (
            <div className="bg-[#12121a]/50 border border-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Your Progress</span>
                <span className="text-sm font-medium">
                  {completedCount} / {course.lessons.length} complete
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    progressPercent === 100 ? "bg-emerald-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lessons List */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold mb-4">Lessons</h2>

          <div className="space-y-3">
            {course.lessons.map((lesson, index) => {
              const completed = isLessonComplete(lesson.id);

              return (
                <Link
                  key={lesson.id}
                  to={`/courses/${courseId}/${lesson.id}`}
                  className="group flex items-center gap-4 p-4 bg-[#12121a]/50 border border-white/5 rounded-xl hover:border-white/10 hover:bg-[#12121a]/80 transition-all"
                >
                  {/* Number / Check */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      completed
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-white/5 text-slate-500"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle size={20} />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium group-hover:text-white transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {lesson.description}
                    </p>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-1 text-xs text-slate-500 flex-shrink-0">
                    <Clock size={12} />
                    {lesson.duration}
                  </div>

                  {/* Arrow */}
                  <Play
                    size={16}
                    className="text-slate-600 group-hover:text-emerald-400 transition-colors flex-shrink-0"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CourseDetail;
