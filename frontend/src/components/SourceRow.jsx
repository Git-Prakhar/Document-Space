import Icon from "../utils/AllIcons";
import Spinner from "./Spinner";


export default function SourceRow({ source, onRemove, SOURCE_TYPES }) {
  const TypeIcon = SOURCE_TYPES.find((t) => t.id === source.type)?.icon ?? Icon.File;
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 group transition-colors">
      <span className="text-neutral-400"><TypeIcon /></span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-neutral-200 truncate">{source.name}</p>
        <p className="text-[10px] text-neutral-500 capitalize">{source.type}</p>
      </div>
      <div className="flex items-center gap-2">
        {source.status === "ready"   && <span className="text-green-400"><Icon.Check /></span>}
        {source.status === "error"   && <span className="text-red-400"><Icon.AlertTriangle /></span>}
        {source.status === "loading" && <Spinner />}
        <button onClick={() => onRemove(source.id)}
          className="text-neutral-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
          <Icon.Trash />
        </button>
      </div>
    </div>
  );
}