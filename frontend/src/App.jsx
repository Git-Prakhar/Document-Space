import ChatPage from "./pages/ChatPage";
import Sidebar from "./pages/Sidebar";
import { useState } from "react";
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    console.log("Hey");
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} />
      <Routes>
        <Route
          path="/chat/:chatId"
          element={
            <ChatPage
              setSidebarOpen={toggleSidebar}
            />
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/chat/c1" />} />
      </Routes>
    </div>
  );
}
