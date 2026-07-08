"use client";
import { useState, KeyboardEvent, useEffect, useRef } from "react";
import { Send, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_K } from "@/lib/constants";

interface ChatInputProps {
  onSend: (question: string, k: number) => void;
  disabled?: boolean;
  initialValue?: string | null;
}

export function ChatInput({ onSend, disabled, initialValue }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [k, setK] = useState(DEFAULT_K);
  const [showSettings, setShowSettings] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // When a suggestion is clicked, fill the input and focus — but don't auto-send
  useEffect(() => {
    if (!initialValue) return;
    setValue(initialValue);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        // Resize textarea to fit content
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
      }
    }, 0);
  }, [initialValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = () => {
    const q = value.trim();
    if (!q || disabled) return;
    onSend(q, k);
    setValue("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.metaKey || e.ctrlKey) {
        // Cmd/Ctrl + Enter → new line (like other LLMs)
        e.preventDefault();
        setValue((v) => v + "\n");
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
              Math.min(textareaRef.current.scrollHeight, 120) + "px";
          }
        }, 0);
      } else {
        // Plain Enter → send
        e.preventDefault();
        handleSend();
      }
    }
  };

  return (
    <div className="border-t border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md px-4 pt-3 pb-4 space-y-2">
      {/* Settings panel */}
      {showSettings && (
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] animate-fade-in">
          <Sliders className="w-3.5 h-3.5 text-[var(--cyan)] flex-shrink-0" />
          <label className="text-xs font-mono text-[var(--text-2)] flex-shrink-0">
            Context chunks (k):
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="flex-1 accent-[var(--cyan)]"
          />
          <span className="text-xs font-mono text-[var(--cyan)] w-4 text-center">{k}</span>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        <div
          className={cn(
            "flex-1 flex items-end gap-2 px-3 py-2 rounded-xl border transition-all duration-200",
            "bg-[var(--card)] border-[var(--border)] focus-within:border-[var(--border-bright)]"
          )}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a 3GPP standards question…  (Enter to send · ⌘+Enter for new line)"
            disabled={disabled}
            rows={1}
            className={cn(
              "flex-1 bg-transparent resize-none text-sm text-[var(--text)]",
              "placeholder:text-[var(--text-3)] focus:outline-none",
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
              ? "bg-[var(--cyan-dim)] border-[var(--border-bright)] text-[var(--cyan)]"
              : "bg-[var(--card)] border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)]"
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
            "bg-[var(--cyan)] text-black font-medium",
            "hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          title="Send (Enter)"
        >
          {disabled ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}