import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Hero";
import Chat from "./pages/Chat";
import Saved from "./pages/Saved";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard/chat" element={<Chat />} />
      <Route path="/dashboard/saved" element={<Saved />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
