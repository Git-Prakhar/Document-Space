import { useState, useEffect, useRef } from "react";
import Icon from "../utils/AllIcons";
import Spinner from "./Spinner";
import SourceRow from "./SourceRow";
import AddSourcePanel from "./AddSourcePanel";

const SOURCE_TYPES = [
  { id: "image",   label: "Image",   icon: Icon.Image,  accept: "image/*" },
  { id: "audio",   label: "Audio",   icon: Icon.Audio,  accept: "audio/*" },
  { id: "website", label: "Website", icon: Icon.Web,    accept: null },
  { id: "file",    label: "File",    icon: Icon.File,   accept: ".txt,.csv,.md,.json" },
  { id: "pdf",     label: "PDF",     icon: Icon.PDF,    accept: ".pdf" },
];

export default function SourcesDropdown({ sources, onAdd, onRemove, onClose }) {
  const [showAdd, setShowAdd] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const ready   = sources.filter((s) => s.status === "ready").length;
  const loading = sources.filter((s) => s.status === "loading").length;
  const errors  = sources.filter((s) => s.status === "error").length;

  return (
    <div ref={ref} className="absolute top-full right-0 mt-2 w-72 rounded-xl border shadow-2xl z-50 overflow-hidden"
      style={{ background: "#16161a", borderColor: "rgba(255,255,255,0.08)", boxShadow: "0 24px 48px rgba(0,0,0,0.6)" }}>
      {/* Stats bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/6">
        <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Sources</span>
        <div className="flex items-center gap-2 ml-auto">
          {ready   > 0 && <span className="flex items-center gap-1 text-[10px] text-green-400"><Icon.Check />{ready} ready</span>}
          {loading > 0 && <span className="flex items-center gap-1 text-[10px] text-amber-400"><Spinner />{loading}</span>}
          {errors  > 0 && <span className="flex items-center gap-1 text-[10px] text-red-400"><Icon.AlertTriangle />{errors} failed</span>}
        </div>
      </div>

      {/* Source list */}
      <div className="max-h-52 overflow-y-auto py-1.5 px-1.5 space-y-0.5">
        {sources.length === 0
          ? <p className="text-center text-xs text-neutral-600 py-6">No sources added yet</p>
          : sources.map((s) => <SourceRow key={s.id} source={s} onRemove={onRemove} SOURCE_TYPES={SOURCE_TYPES} />)
        }
      </div>

      {/* Add section */}
      {showAdd
        ? <AddSourcePanel onAdd={(s) => { onAdd(s); setShowAdd(false); }} onClose={() => setShowAdd(false)} SOURCE_TYPES={SOURCE_TYPES} />
        : (
          <div className="border-t border-white/6 p-2">
            <button onClick={() => setShowAdd(true)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs text-neutral-400 hover:text-amber-400 hover:bg-white/5 transition-colors font-medium">
              <Icon.Plus /> Add source
            </button>
          </div>
        )}
    </div>
  );
}