import ChatPage from "./pages/ChatPage";
import Sidebar from "./pages/Sidebar";
import { useState } from "react";

export default function App() {
  const RECENT_CHATS = [
    {
      id: "c1",
      title: "Research on climate change",
      time: "2h ago",
      sources: 3,
    },
    {
      id: "c2",
      title: "Quarterly report analysis",
      time: "Yesterday",
      sources: 1,
    },
    { id: "c3", title: "Legal contract review", time: "2d ago", sources: 5 },
    { id: "c4", title: "Product design feedback", time: "3d ago", sources: 2 },
    {
      id: "c5",
      title: "Market research deep dive",
      time: "1w ago",
      sources: 0,
    },
  ];

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
      <Sidebar
        sidebarOpen={sidebarOpen}
        setActiveChat={setActiveChat}
        activeChat={activeChat}
        setChatTitle={setChatTitle}
        setTitleDraft={setTitleDraft}
        RECENT_CHATS={RECENT_CHATS}
      />
      <ChatPage
        setSidebarOpen={toggleSidebar}
        chatTitle={chatTitle}
        setChatTitle={setChatTitle}
        titleDraft={titleDraft}
        setTitleDraft={setTitleDraft}
      />
    </div>
  );
}
