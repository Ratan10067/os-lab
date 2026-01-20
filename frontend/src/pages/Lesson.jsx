import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Terminal as TerminalIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Lightbulb,
  BookOpen,
  Play,
  Loader,
} from "lucide-react";
import {
  getCourseById,
  getLessonById,
  getNextLesson,
} from "../data/courseData";
import { useAuth } from "../context/AuthContext";
import { API_URL, WS_URL } from "../config";
import Terminal from "../components/Terminal";
import useWebSocket from "../hooks/useWebSocket";
import ReactMarkdown from "react-markdown";

function Lesson() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const terminalRef = useRef(null);

  const [sessionId] = useState(() => crypto.randomUUID());
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [marking, setMarking] = useState(false);

  const course = getCourseById(courseId);
  const lesson = getLessonById(courseId, lessonId);
  const nextLesson = getNextLesson(courseId, lessonId);

  // WebSocket connection
  const token = localStorage.getItem("auth_token");
  const wsUrl = token
    ? `${WS_URL}?session=${sessionId}&token=${token}`
    : `${WS_URL}?session=${sessionId}`;

  const { isConnected, sendMessage, setMessageHandler, reconnect } =
    useWebSocket(wsUrl);

  // Handle incoming data - set up message handler in useEffect
  useEffect(() => {
    setMessageHandler((data) => {
      if (terminalRef.current) {
        terminalRef.current.write(data);
      }
    });
  }, [setMessageHandler]);

  // Handle terminal input
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

  // Check if lesson is complete
  useEffect(() => {
    const checkProgress = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(`${API_URL}/api/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const lessonKey = `${courseId}:${lessonId}`;
          setIsComplete(data.completed_lessons?.includes(lessonKey) || false);
        }
      } catch (error) {
        console.error("Failed to check progress:", error);
      }
    };

    checkProgress();
  }, [user, courseId, lessonId]);

  // Mark lesson as complete
  const markComplete = async () => {
    if (!user || isComplete || marking) return;

    setMarking(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_URL}/api/progress/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ course_id: courseId, lesson_id: lessonId }),
      });

      if (response.ok) {
        setIsComplete(true);
      }
    } catch (error) {
      console.error("Failed to mark complete:", error);
    } finally {
      setMarking(false);
    }
  };

  if (!course || !lesson) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Link to="/courses" className="text-emerald-400 hover:underline">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // Find current lesson index
  const currentIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Navbar */}
      <nav className="h-14 bg-[#12121a]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 flex-shrink-0">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
            <TerminalIcon size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg hidden sm:block">OS Lab</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/courses/${courseId}`}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">{course.title}</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Theory Panel */}
        <div className="lg:w-1/2 xl:w-2/5 overflow-y-auto border-b lg:border-b-0 lg:border-r border-white/5 p-6">
          {/* Lesson Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <BookOpen size={14} />
              Lesson {currentIndex + 1} of {course.lessons.length}
            </div>
            <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
            <p className="text-slate-400">{lesson.description}</p>
          </div>

          {/* Theory Content */}
          <div className="prose prose-invert prose-sm max-w-none mb-8">
            <ReactMarkdown
              components={{
                code: ({ node, inline, className, children, ...props }) => {
                  if (inline) {
                    return (
                      <code
                        className="px-1.5 py-0.5 bg-white/10 rounded text-emerald-300 text-xs"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <pre className="bg-[#0a0a0f] border border-white/10 rounded-lg p-3 overflow-x-auto">
                      <code className="text-sm" {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold mt-6 mb-3">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-semibold mt-5 mb-2">
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p className="text-slate-300 mb-3">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {children}
                  </ul>
                ),
              }}
            >
              {lesson.theory}
            </ReactMarkdown>
          </div>

          {/* Challenge Section */}
          <div className="bg-[#12121a] border border-white/10 rounded-xl p-4 mb-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Play size={16} className="text-emerald-400" />
              Challenge
            </h3>
            <p className="text-sm text-slate-300 mb-3">{lesson.challenge}</p>

            {/* Hint Toggle */}
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"
            >
              <Lightbulb size={12} />
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <p className="text-xs text-amber-400/80 mt-2 p-2 bg-amber-500/10 rounded">
                💡 {lesson.hint}
              </p>
            )}
          </div>

          {/* Complete Button */}
          <div className="flex items-center gap-4">
            {isComplete ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle size={20} />
                <span className="font-medium">Completed!</span>
              </div>
            ) : user ? (
              <button
                onClick={markComplete}
                disabled={marking}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {marking ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                Mark as Complete
              </button>
            ) : (
              <Link
                to="/login"
                className="text-sm text-slate-400 hover:text-white"
              >
                Login to track progress
              </Link>
            )}

            {/* Next Lesson Link */}
            {nextLesson && isComplete && (
              <Link
                to={`/courses/${courseId}/${nextLesson.id}`}
                className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
              >
                Next: {nextLesson.title}
                <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>

        {/* Terminal Panel */}
        <div className="lg:w-1/2 xl:w-3/5 flex flex-col bg-[#0a0a0f] min-h-[300px] lg:min-h-0">
          {/* Terminal Header */}
          <div className="h-10 bg-[#12121a] border-b border-white/5 flex items-center justify-between px-4 flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <TerminalIcon size={14} />
              Practice Terminal
            </div>
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
          </div>

          {/* Terminal */}
          <div className="flex-1 p-2">
            <Terminal
              ref={terminalRef}
              onData={handleTerminalData}
              onResize={handleTerminalResize}
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="h-14 bg-[#12121a] border-t border-white/5 flex items-center justify-between px-4 flex-shrink-0">
        {prevLesson ? (
          <Link
            to={`/courses/${courseId}/${prevLesson.id}`}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
            Previous
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            to={`/courses/${courseId}/${nextLesson.id}`}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Next
            <ChevronRight size={16} />
          </Link>
        ) : (
          <Link
            to={`/courses/${courseId}`}
            className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Back to Course
            <ChevronRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}

export default Lesson;
