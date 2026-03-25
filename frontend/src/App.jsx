import ChatPage from "./pages/ChatPage";
import Sidebar from "./pages/Sidebar";
import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

export default function App() {
  const [activeChat, setActiveChat] = useState("c1");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatTitle, setChatTitle] = useState("Research on climate change");
  const [titleDraft, setTitleDraft] = useState(chatTitle);

  const toggleSidebar = () => {
    console.log("Hey");
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} activeChat={activeChat} />
      <Routes>
        <Route
          path="/chat/:chatId"
          element={
            <ChatPage
              setSidebarOpen={toggleSidebar}
              chatTitle={chatTitle}
              setChatTitle={setChatTitle}
              titleDraft={titleDraft}
              setTitleDraft={setTitleDraft}
            />
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/chat/c1" />} />
      </Routes>
    </div>
  );
}
