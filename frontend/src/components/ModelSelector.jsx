import { useState, useRef, useEffect } from "react";
import Icon from "../utils/AllIcons";

export default function ModelSelector({ model, onChange, MODELS }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = MODELS.find((m) => m.id === model) ?? MODELS[0];

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#a0a0b0" }}>
        <Icon.Bot />
        <span>{current.label}</span>
        <span className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>{current.badge}</span>
        <Icon.ChevronDown />
      </button>
      {open && (
        <div className="absolute bottom-full mb-2 left-0 w-52 rounded-xl border overflow-hidden shadow-2xl z-50"
          style={{ background: "#16161a", borderColor: "rgba(255,255,255,0.08)", boxShadow: "0 16px 40px rgba(0,0,0,0.6)" }}>
          {MODELS.map((m) => (
            <button key={m.id} onClick={() => { onChange(m.id); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs text-left transition-colors hover:bg-white/5 ${model === m.id ? "text-amber-400" : "text-neutral-300"}`}>
              <span className="flex-1">{m.label}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: "rgba(255,255,255,0.06)", color: "#777" }}>{m.badge}</span>
              {model === m.id && <Icon.Check />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}