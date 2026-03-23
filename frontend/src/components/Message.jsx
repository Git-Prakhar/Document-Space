import Icon from "../utils/AllIcons"

export default function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isUser ? "bg-amber-500/20 text-amber-400" : "bg-white/6 text-neutral-300"}`}>
        {isUser
          ? <span className="text-xs font-bold">U</span>
          : <Icon.Bot />}
      </div>
      {/* Bubble */}
      <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? "rounded-tr-sm text-neutral-100"
          : "rounded-tl-sm text-neutral-200"
      }`} style={isUser
        ? { background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.18)" }
        : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }
      }>
        {msg.text}
        {msg.streaming && <span className="inline-block w-0.5 h-4 ml-1 bg-amber-400 animate-pulse rounded" />}
      </div>
    </div>
  );
}