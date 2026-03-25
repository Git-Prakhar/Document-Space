import Icon from "../utils/AllIcons";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../utils/Supabase";
import { useEffect, useState, useRef } from "react";

export default function Sidebar({ sidebarOpen }) {
  const [RECENT_CHATS, setRecentChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const createChatBtn = useRef(null);

  const navigate = useNavigate();

  const getTimeLabel = (lastActive) => {
    if (!lastActive || isNaN(new Date(lastActive))) {
      return "Unknown";
    }

    const currentTime = new Date();
    const lastActiveTime = new Date(lastActive);
    const timeDiff = Math.floor((currentTime - lastActiveTime) / 1000);
    console.log("Time difference in seconds:", timeDiff);

    if (timeDiff < 0) return "Just now";

    if (timeDiff < 60) return "Just now";

    if (timeDiff < 3600) {
      const mins = Math.floor(timeDiff / 60);
      return `${mins} min${mins > 1 ? "s" : ""} ago`;
    }

    if (timeDiff < 86400) {
      const hrs = Math.floor(timeDiff / 3600);
      return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(timeDiff / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const getRecentChats = async () => {
    const { data, error } = await supabase
      .from("chat_table")
      .select("chat_id, title, last_active, source_count")
      .order("last_active", { ascending: false });

    if (error) {
      console.error("Error fetching recent chats:", error);
    } else {
      const formattedChats = data.map((chat) => {
        return {
          id: chat.chat_id,
          title: chat.title,
          time: getTimeLabel(chat.last_active),
          sources: chat.source_count,
        };
      });
      setRecentChats(formattedChats);
    }
  };

  const location = useLocation();

  const getActiveChat = () => {
    const chatId = location.pathname.split("/chat/")[1];
    console.log("Current chat ID from URL:", chatId);
    if (chatId) {
      setActiveChat(chatId);
    }
  };

  const changeChat = async (chatId) => {
    const currentChatId = location.pathname.split("/chat/")[1];

    const { data, getError } = await supabase
      .from("chat_table")
      .select("messages")
      .eq("chat_id", currentChatId)
      .single();

    if (getError) {
      console.error("Error checking current chat messages:", getError);
      return;
    }

    if (data.messages["messages"].length == 0) {
      await supabase.from("chat_table").delete().eq("chat_id", currentChatId);
      setRecentChats((prev) =>
        prev.filter((chat) => chat.id !== currentChatId),
      );
    }

    navigate(`/chat/${chatId}`);
    setActiveChat(chatId);
  };

  const createNewChat = async () => {
    // Validation for existing "New Chat" with messages
    try {
      createChatBtn.current.disabled = true;
      createChatBtn.current.innerText = "Creating chat...";
      const currentChatId = location.pathname.split("/chat/")[1];
      const { data, getError } = await supabase
        .from("chat_table")
        .select("messages")
        .eq("chat_id", currentChatId)
        .single();

      if (getError) {
        console.error("Error checking current chat messages:", getError);
        throw getError;
      }

      if (data.messages["messages"].length == 0) {
        alert(
          "Please save or clear your current chat before starting a new one.",
        );
        throw new Error("Current chat has unsaved messages");
      }

      const newChatId = `c${Date.now()}`;

      const newChat = {
        chat_id: newChatId,
        title: "New Chat",
        last_active: new Date().toISOString(),
        source_count: 0,
        sources: { sources: [] },
        title_draft: "New Chat",
        messages: { messages: [] },
      };

      const { error } = await supabase.from("chat_table").insert(newChat);

      if (error) {
        throw error;
      }

      navigate(`/chat/${newChatId}`);
      setActiveChat(newChatId);
      setRecentChats((prev) => [
        {
          id: newChatId,
          title: "New Chat",
          time: getTimeLabel(new Date().toISOString()),
          sources: 0,
        },
        ...prev,
      ]);

      createChatBtn.current.disabled = false;
      createChatBtn.current.innerText = "New chat";
    } catch (err) {
      console.error("Unexpected error creating new chat:", err);
      createChatBtn.current.disabled = false;
      createChatBtn.current.innerText = "New chat";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      getActiveChat();
      await getRecentChats();
    };

    fetchData();
  }, []);

  return (
    <aside
      className="flex-shrink-0 flex flex-col border-r transition-all duration-300 overflow-hidden"
      style={{
        width: sidebarOpen ? 240 : 0,
        borderColor: "rgba(255,255,255,0.06)",
        background: "#111115",
      }}
    >
      <div className="flex flex-col h-full" style={{ width: 240 }}>
        {/* Logo / brand */}
        <div
          className="flex items-center gap-2.5 px-5 py-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}
          >
            <svg viewBox="0 0 16 16" fill="white" className="w-3.5 h-3.5">
              <path d="M8 1l1.9 3.8L14 5.8l-3 2.9.7 4.1L8 10.8l-3.7 1.95.7-4.1L2 5.8l4.1-.95L8 1z" />
            </svg>
          </div>
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: "#e4e4f0" }}
          >
            SourceChat
          </span>
        </div>

        {/* New Chat button */}
        <div className="px-3 pt-3 pb-2">
          <button
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:bg-white/5"
            style={{
              color: "#9090a8",
              border: "1px dashed rgba(255,255,255,0.1)",
            }}
            onClick={createNewChat}
            ref={createChatBtn}
          >
            <Icon.NewChat />
            <span>New chat</span>
          </button>
        </div>

        {/* Recent chats */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
          <p
            className="text-[10px] uppercase tracking-widest px-2 py-1.5"
            style={{ color: "#555566" }}
          >
            Recent
          </p>
          {RECENT_CHATS.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                changeChat(chat.id);
              }}
              className={`w-full text-left px-2.5 py-2.5 rounded-lg transition-all group ${activeChat === chat.id ? "bg-white/7" : "hover:bg-white/4"}`}
            >
              <p
                className={`text-xs font-medium truncate mb-0.5 ${activeChat === chat.id ? "text-neutral-100" : "text-neutral-400 group-hover:text-neutral-200"}`}
              >
                {chat.title}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px]" style={{ color: "#555566" }}>
                  {chat.time}
                </span>
                {chat.sources > 0 && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      background: "rgba(245,158,11,0.1)",
                      color: "#9a7030",
                    }}
                  >
                    {chat.sources} src
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* User area */}
        <div
          className="px-3 py-3 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2.5 px-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "linear-gradient(135deg,#f59e0b44,#ef444433)",
                color: "#f59e0b",
              }}
            >
              PB
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-neutral-300 truncate">
                Prakhar Boss
              </p>
              <p className="text-[10px]" style={{ color: "#555" }}>
                Prooooo plan
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
