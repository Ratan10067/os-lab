import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Lab from "./pages/Lab";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lab" element={<Lab />} />
      <Route path="/lab/:labId" element={<Lab />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
