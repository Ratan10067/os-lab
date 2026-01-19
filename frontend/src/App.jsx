import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Lab from "./pages/Lab";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Lesson from "./pages/Lesson";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/lab"
        element={
          <ProtectedRoute>
            <Lab />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/:labId"
        element={
          <ProtectedRoute>
            <Lab />
          </ProtectedRoute>
        }
      />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:courseId" element={<CourseDetail />} />
      <Route path="/courses/:courseId/:lessonId" element={<Lesson />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
