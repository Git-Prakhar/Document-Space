import { useState, useRef } from "react";

export default function AddSourcePanel({ onAdd, onClose, SOURCE_TYPES }) {
  const [urlInput, setUrlInput] = useState("");
  const [activeType, setActiveType] = useState(null);
  const fileRef = useRef(null);

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onAdd({ type, name: file.name, file });
    e.target.value = "";
    onClose();
  };

  const handleURL = () => {
    if (!urlInput.trim()) return;
    const name = urlInput.replace(/^https?:\/\//, "").slice(0, 40);
    onAdd({ type: "website", name });
    setUrlInput("");
    onClose();
  };

  return (
    <div className="border-t border-white/8 pt-3 mt-1">
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 px-3 mb-2">Add source</p>
      <div className="grid grid-cols-5 gap-1 px-3 mb-3">
        {SOURCE_TYPES.map((t) => {
          const TIcon = t.icon;
          return (
            <button key={t.id}
              onClick={() => {
                if (t.id === "website") { setActiveType("website"); return; }
                setActiveType(t.id);
                setTimeout(() => document.getElementById(`file-input-${t.id}`)?.click(), 50);
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/8 transition-colors text-neutral-400 hover:text-amber-400">
              <TIcon />
              <span className="text-[9px]">{t.label}</span>
              {t.accept && (
                <input id={`file-input-${t.id}`} type="file" accept={t.accept} className="hidden"
                  onChange={(e) => handleFileChange(e, t.id)} />
              )}
            </button>
          );
        })}
      </div>
      {activeType === "website" && (
        <div className="px-3 flex gap-2 mb-1">
          <input autoFocus value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleURL()}
            placeholder="https://example.com"
            className="flex-1 text-xs px-3 py-1.5 rounded-lg outline-none bg-white/5 border border-white/10 text-neutral-200 placeholder-neutral-600 focus:border-amber-500/40" />
          <button onClick={handleURL}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/30 transition-colors">
            Add
          </button>
        </div>
      )}
    </div>
  );
}