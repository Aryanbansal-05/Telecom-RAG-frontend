"use client";
import { useState, KeyboardEvent } from "react";
import { Send, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_K } from "@/lib/constants";

interface ChatInputProps {
  onSend: (question: string, k: number) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [k, setK] = useState(DEFAULT_K);
  const [showSettings, setShowSettings] = useState(false);

  const handleSend = () => {
    const q = value.trim();
    if (!q || disabled) return;
    onSend(q, k);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-[var(--border-color)] bg-[var(--bg-primary)]/90 backdrop-blur-md px-4 pt-3 pb-4 space-y-2">
      {/* Settings panel */}
      {showSettings && (
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] animate-fade-in">
          <Sliders className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" />
          <label className="text-xs font-mono text-[var(--text-muted)] flex-shrink-0">
            Context chunks (k):
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="flex-1 accent-[var(--accent)]"
          />
          <span className="text-xs font-mono text-[var(--accent)] w-4 text-center">{k}</span>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        <div
          className={cn(
            "flex-1 flex items-end gap-2 px-3 py-2 rounded-xl border transition-all duration-200",
            "bg-[var(--bg-card)] border-[var(--border-color)] focus-within:border-[var(--border-hover)]"
          )}
        >
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a 3GPP standards question…  (⌘ + Enter to send)"
            disabled={disabled}
            rows={1}
            className={cn(
              "flex-1 bg-transparent resize-none text-sm text-[var(--text-primary)]",
              "placeholder:text-[var(--text-muted)] focus:outline-none",
              "min-h-[36px] max-h-[120px] font-mono"
            )}
            style={{ lineHeight: "1.5" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 120) + "px";
            }}
          />
        </div>

        {/* Settings toggle */}
        <button
          onClick={() => setShowSettings((s) => !s)}
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border",
            showSettings
              ? "bg-[var(--accent-dim)] border-[var(--border-hover)] text-[var(--accent)]"
              : "bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          )}
          title="Retrieval settings"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200",
            "bg-[var(--accent)] text-navy-900 font-medium",
            "hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          title="Send (⌘ + Enter)"
        >
          {disabled ? (
            <div className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
