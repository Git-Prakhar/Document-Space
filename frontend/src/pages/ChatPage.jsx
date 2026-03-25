import { useState, useRef, useEffect } from "react";
import Icon from "../utils/AllIcons.jsx";
import ModelSelector from "../components/ModelSelector.jsx";
import Spinner from "../components/Spinner.jsx";
import SourcesDropdown from "../components/SourcesDropdown.jsx";
import Message from "../components/Message.jsx";
import { supabase } from "../utils/Supabase.js";
import { useParams } from "react-router-dom";


// ── Main Page ─────────────────────────────────────────────────────────────────
let idCounter = 10;
function uid() {
  return `s${++idCounter}`;
}

export default function ChatPage({setSidebarOpen}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [model, setModel] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const titleInputRef = useRef(null);
  const [MODELS, setMODELS] = useState([]);
  const { chatId } = useParams();
  const [chatTitle, setChatTitle] = useState("");
  const [titleDraft, setTitleDraft] = useState("");

  const [sources, setSources] = useState([]);

  const fetchInitialData = async () => {
    try {
      const { data, error } = await supabase.from("model_list").select("*");
      if (error) throw error;
      console.log(data);
      const models = data.map((d) => ({
        id: d.model_id,
        label: d.label,
        badge: d.badge,
      }));
      setMODELS(models);
      setModel(models[0].id);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  // Simulate the loading source becoming ready
  useEffect(() => {
    const t = setTimeout(() => {
      setSources((prev) =>
        prev.map((s) =>
          s.status === "loading" ? { ...s, status: "ready" } : s,
        ),
      );
    }, 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    async function waitForBackend() {
      await fetchInitialData();
    }
    waitForBackend();
  }, []);

  const fetchChatData = async (chatId) => {
    console.log("Fetching data for chat ID:", chatId);
    const {data, error} = await supabase.from("chat_table").select("*").eq("chat_id", chatId).single();
    if(error){
      console.error("Error fetching chat data:", error);
      return;
    }

    setMessages(data.messages['messages'] || []);
    setChatTitle(data.title);
    setTitleDraft(data.title_draft);
    setSources(data.sources['sources'] || []);
  };



  useEffect(() => {
    console.log('Chat ID from params:', chatId);
    if (chatId) {
      fetchChatData(chatId);
    }
  }, [chatId]);

  const addSource = async ({ type, name, file }) => {
    const newSrc = { id: uid(), type, name, status: "loading" };
    setSources((prev) => [...prev, newSrc]);

    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("type", type);

    try{
      const res = await fetch("http://localhost:8000/save-source", {
        method: "POST",
        body: formdata,
      });
      if (res.status !== 200) throw new Error("Failed to upload source");

      setSources((prev) =>
        prev.map((s) =>
          s.id === newSrc.id ? { ...s, status: "ready" } : s,
        ),
      );
    }
    catch(err){
      console.error(err);
      setSources((prev) =>
        prev.map((s) =>
          s.id === newSrc.id ? { ...s, status: "error" } : s,
        ),
      );
    }
  };

  const removeSource = (id) =>
    setSources((prev) => prev.filter((s) => s.id !== id));

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { id: uid(), role: "user", text };
    const asstMsg = { id: uid(), role: "assistant", text: "", streaming: true };
    setMessages((prev) => [...prev, userMsg, asstMsg]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Simulate streaming
    const reply =
      "I've analyzed the sources you've provided. Based on the documents and recordings available, the mitigation strategies discussed include carbon capture technologies, renewable energy transitions, and policy-level interventions at the international level. The audio recording specifically mentions a 40% reduction target by 2035 as the most feasible pathway according to current modelling.";
    let i = 0;
    const iv = setInterval(() => {
      i += Math.floor(Math.random() * 6) + 2;
      const chunk = reply.slice(0, i);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === asstMsg.id
            ? { ...m, text: chunk, streaming: i < reply.length }
            : m,
        ),
      );
      if (i >= reply.length) clearInterval(iv);
    }, 28);
  };

  const confirmTitle = () => {
    setChatTitle(titleDraft.trim() || chatTitle);
    setEditingTitle(false);
  };

  const readySources = sources.filter((s) => s.status === "ready").length;

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{
        background: "#0e0e12",
        fontFamily: "'DM Sans', sans-serif",
        color: "#e4e4f0",
      }}
    >

      {/* ── Main panel ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Top bar ── */}
        <header
          className="flex items-center gap-3 px-4 h-14 flex-shrink-0 border-b"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "#111115",
          }}
        >
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen()}
            className="text-neutral-500 hover:text-neutral-300 transition-colors p-1"
          >
            <Icon.Menu />
          </button>

          {/* Chat title */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            {editingTitle ? (
              <input
                ref={titleInputRef}
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={confirmTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmTitle();
                  if (e.key === "Escape") setEditingTitle(false);
                }}
                className="text-sm font-semibold bg-transparent outline-none border-b border-amber-500/60 text-neutral-100 w-full max-w-xs"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            ) : (
              <button
                onClick={() => {
                  setEditingTitle(true);
                  setTitleDraft(chatTitle);
                  setTimeout(() => titleInputRef.current?.select(), 50);
                }}
                className="group flex items-center gap-1.5 min-w-0"
              >
                <span className="text-sm font-semibold text-neutral-100 truncate max-w-xs">
                  {chatTitle}
                </span>
                <span className="text-neutral-600 group-hover:text-neutral-400 transition-colors opacity-0 group-hover:opacity-100">
                  <Icon.Edit />
                </span>
              </button>
            )}
          </div>

          {/* Sources dropdown trigger */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setSourcesOpen(!sourcesOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: sourcesOpen
                  ? "rgba(245,158,11,0.12)"
                  : "rgba(255,255,255,0.05)",
                border: `1px solid ${sourcesOpen ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.08)"}`,
                color: sourcesOpen ? "#f59e0b" : "#9090a8",
              }}
            >
              <span>Sources</span>
              {readySources > 0 && (
                <span
                  className="w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold"
                  style={{
                    background: "rgba(74,222,128,0.2)",
                    color: "#4ade80",
                  }}
                >
                  {readySources}
                </span>
              )}
              {sources.some((s) => s.status === "error") && (
                <span className="text-red-400">
                  <Icon.AlertTriangle />
                </span>
              )}
              {sources.some((s) => s.status === "loading") && <Spinner />}
              <Icon.ChevronDown />
            </button>
            {sourcesOpen && (
              <SourcesDropdown
                sources={sources}
                onAdd={addSource}
                onRemove={removeSource}
                onClose={() => setSourcesOpen(false)}
              />
            )}
          </div>
        </header>

        {/* ── Chat area ── */}
        <main
          className="flex-1 overflow-y-auto px-4 py-6 space-y-5"
          style={{ background: "#0e0e12" }}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.2)",
                }}
              >
                <Icon.Bot />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-300 mb-1">
                  Start by adding sources
                </p>
                <p className="text-xs text-neutral-600">
                  Upload files, images, audio, or add a website link to chat
                  with your content.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => <Message key={msg.id} msg={msg} />)
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* ── Input bar ── */}
        <footer
          className="flex-shrink-0 px-4 py-3 border-t"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "#111115",
          }}
        >
        
          <div className="flex items-center gap-2">
            {/* Model selector */}
            {MODELS.length > 0 && (
              <ModelSelector
                model={model}
                onChange={setModel}
                MODELS={MODELS}
              />
            )}
            {/* <ModelSelector model={model} onChange={setModel} MODELS={MODELS} /> */}

            {/* Textarea */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 140) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask anything about your sources…"
                className="w-full resize-none text-sm px-4 py-2.5 rounded-xl outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#e4e4f0",
                  caretColor: "#f59e0b",
                  fontFamily: "'DM Sans', sans-serif",
                  minHeight: "42px",
                  maxHeight: "140px",
                  lineHeight: "1.5",
                }}
              />
            </div>

            {/* Send */}
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
              style={{
                background: input.trim()
                  ? "linear-gradient(135deg,#f59e0b,#ef4444)"
                  : "rgba(255,255,255,0.05)",
                color: input.trim() ? "white" : "#444",
                boxShadow: input.trim()
                  ? "0 4px 16px rgba(245,158,11,0.3)"
                  : "none",
              }}
            >
              <Icon.Send />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
