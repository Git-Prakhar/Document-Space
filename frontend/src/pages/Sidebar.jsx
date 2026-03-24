import Icon from "../utils/AllIcons";

export default function Sidebar({
  sidebarOpen,
  setActiveChat,
  activeChat,
  setChatTitle,
  setTitleDraft,
  RECENT_CHATS
}) {
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
                setActiveChat(chat.id);
                setChatTitle(chat.title);
                setTitleDraft(chat.title);
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
              J
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-neutral-300 truncate">
                Jamie Chen
              </p>
              <p className="text-[10px]" style={{ color: "#555" }}>
                Free plan
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
