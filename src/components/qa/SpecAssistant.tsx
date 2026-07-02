"use client";
import { useEffect, useRef, useState } from "react";
import { Send, Trash2, History, Settings } from "lucide-react";
import { chatStorage } from "@/lib/chatStorage";
import { useAsk } from "@/hooks/useAsk";
import { useApiHealth } from "@/hooks/useApiHealth";
import type { ChatMessage } from "@/lib/types";
import { SUGGESTED_QUERIES } from "@/lib/constants";

const QUERY_CATEGORIES = [
  { cat: "Standard 38.331", query: SUGGESTED_QUERIES[0] },
  { cat: "Security Architecture", query: SUGGESTED_QUERIES[1] },
  { cat: "Power Management", query: SUGGESTED_QUERIES[2] },
  { cat: "Network Slicing", query: SUGGESTED_QUERIES[3] },
];

export function SpecAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [k] = useState(5);
  const { ask, loading } = useAsk();
  const health = useApiHealth();
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const h = chatStorage.getMessages();
    if (h.length) setMessages(h);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (q?: string) => {
    const question = (q ?? input).trim();
    if (!question || loading) return;
    setInput("");

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
      timestamp: Date.now(),
    };
    setMessages((p) => [...p, userMsg]);

    const res = await ask(question, k);
    if (res) {
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: res.answer,
        sources: res.sources,
        timestamp: Date.now(),
      };
      setMessages((p) => [...p, aiMsg]);
    }
  };

  const clear = () => { chatStorage.clearHistory(); setMessages([]); };

  return (
    <div className="flex h-[calc(100vh-84px)]">
      {/* ── Left sidebar ─────────────────── */}
      <aside
        className="w-64 flex flex-col shrink-0 overflow-y-auto"
        style={{ borderRight: "1px solid var(--border)" }}
      >
        {/* Suggested queries */}
        <div className="p-4 space-y-1">
          <p className="section-label mb-3">Suggested Queries</p>
          {QUERY_CATEGORIES.map(({ cat, query }) => (
            <button
              key={cat}
              onClick={() => send(query)}
              className="w-full text-left p-3 space-y-1 transition-colors aero-card-hover"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "2px" }}
            >
              <p className="text-[9px] font-bold tracking-[0.12em] uppercase" style={{ color: "var(--cyan)" }}>
                {cat}
              </p>
              <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-2)" }}>{query}</p>
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Engine status — live */}
        <div
          className="p-4 space-y-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="status-dot"
              style={{ background: health.status === "ok" ? "var(--cyan)" : health.status === "loading" ? "var(--amber)" : "var(--red)" }}
            />
            <p className="section-label">Engine Status</p>
          </div>

          {/* Live stats */}
          <div className="space-y-1.5">
            {[
              { label: "Knowledge Base", value: "TeleQnA" },
              { label: "Embedding",      value: "BAAI/bge-large-en" },
              { label: "LLM",            value: "Mistral-7B-Instruct" },
              { label: "Backend",        value: health.status === "ok" ? `Online · ${health.responseMs ?? "—"}ms` : health.status === "loading" ? "Connecting…" : "Offline" },
              { label: "Session Queries",value: String(messages.filter(m => m.role === "user").length) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[9px] font-bold tracking-wider uppercase" style={{ color: "var(--text-3)" }}>{label}</span>
                <span className="text-[9px] font-mono" style={{ color: health.status === "ok" && label === "Backend" ? "var(--cyan)" : "var(--text-2)" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main chat area ──────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-3 shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h2 className="text-xl font-black" style={{ color: "var(--text)" }}>Spec Assistant</h2>
            <p className="text-[9px] tracking-[0.1em] uppercase" style={{ color: "var(--text-3)" }}>
              {messages.length > 0
                ? `${messages.filter(m => m.role === "user").length} quer${messages.filter(m => m.role === "user").length === 1 ? "y" : "ies"} · session active`
                : "Session Ready · Awaiting Query"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button onClick={clear} className="p-1.5 transition-colors hover:text-[var(--red)]" style={{ color: "var(--text-3)" }}>
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button className="p-1.5 transition-colors hover:text-[var(--cyan)]" style={{ color: "var(--text-3)" }}>
              <History className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 transition-colors hover:text-[var(--cyan)]" style={{ color: "var(--text-3)" }}>
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {messages.length === 0 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              {/* System init message */}
              <div className="flex gap-3">
                <div
                  className="w-7 h-7 flex items-center justify-center text-xs font-black shrink-0"
                  style={{ background: "var(--cyan-dim)", border: "1px solid var(--cyan)", color: "var(--cyan)", borderRadius: "2px" }}
                >
                  AI
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-sm" style={{ color: "var(--text)" }}>
                    System initialized. I am your specialized interface for 3GPP technical specifications. How can I assist with your standards query today?
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {["v18.2.0 Index", "RAN1 Knowledge", "Security Protocol Base"].map((tag) => (
                      <span key={tag} className="aero-tag" style={{ color: "var(--text-2)", borderColor: "var(--border-bright)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 animate-[slideUp_0.25s_ease-out] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {msg.role === "assistant" ? (
                <div
                  className="w-7 h-7 flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                  style={{ background: "var(--cyan-dim)", border: "1px solid var(--cyan)", color: "var(--cyan)", borderRadius: "2px" }}
                >
                  AI
                </div>
              ) : (
                <div
                  className="w-7 h-7 flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                  style={{ background: "var(--surface)", border: "1px solid var(--border-bright)", color: "var(--text-2)", borderRadius: "2px" }}
                >
                  U
                </div>
              )}

              <div className={`space-y-2 max-w-[80%] ${msg.role === "user" ? "items-end flex flex-col" : ""}`}>
                <div
                  className="px-4 py-3 text-sm leading-relaxed"
                  style={{
                    background: msg.role === "user" ? "var(--surface)" : "var(--card)",
                    border: `1px solid ${msg.role === "user" ? "var(--border-bright)" : "var(--border)"}`,
                    borderRadius: "2px",
                    color: "var(--text)",
                  }}
                >
                  {msg.content}
                </div>

                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div
                    className="flex items-center gap-2 px-3 py-2"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "2px", width: "100%" }}
                  >
                    <span className="text-[9px] font-bold" style={{ color: "var(--text-3)" }}>📄</span>
                    <span className="text-[9px] font-mono flex-1 truncate" style={{ color: "var(--text-2)" }}>
                      {msg.sources[0]}
                    </span>
                    <button className="aero-tag" style={{ color: "var(--cyan)", borderColor: "var(--cyan)", fontSize: "8px" }}>
                      Open Ref
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 animate-[fadeIn_0.2s_ease-out]">
              <div
                className="w-7 h-7 flex items-center justify-center text-xs font-black shrink-0"
                style={{ background: "var(--cyan-dim)", border: "1px solid var(--cyan)", color: "var(--cyan)", borderRadius: "2px" }}
              >
                AI
              </div>
              <div
                className="px-4 py-3 flex items-center gap-1.5"
                style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "2px" }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--cyan)", animation: `pulseDot 1.2s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div
          className="px-6 py-4 space-y-2 shrink-0"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div
            className="flex items-end gap-2 px-4 py-3"
            style={{ background: "var(--surface)", border: "1px solid var(--border-bright)", borderRadius: "2px" }}
          >
            <span className="text-[10px] font-bold shrink-0 mb-0.5" style={{ color: "var(--text-3)" }}>λ</span>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }}
              placeholder="Query technical specifications (e.g., /ref 38.331 section 5.2)..."
              rows={1}
              className="flex-1 bg-transparent text-xs font-mono resize-none focus:outline-none"
              style={{ color: "var(--text)", maxHeight: 120 }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 120) + "px";
              }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="w-8 h-8 flex items-center justify-center transition-all shrink-0"
              style={{
                background: input.trim() && !loading ? "var(--cyan)" : "var(--border-bright)",
                color: input.trim() && !loading ? "#000" : "var(--text-3)",
                borderRadius: "2px",
              }}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[9px] text-center tracking-[0.08em]" style={{ color: "var(--text-3)" }}>
            ⌘K to search history · ^ Enter for multi-line
          </p>
        </div>
      </div>
    </div>
  );
}
