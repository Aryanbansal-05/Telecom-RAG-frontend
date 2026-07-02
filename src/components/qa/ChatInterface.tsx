"use client";
import { useEffect, useRef, useState } from "react";
import { Trash2, MessageSquare } from "lucide-react";
import { ChatMessageBubble } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SuggestedQueries } from "./SuggestedQueries";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { chatStorage } from "@/lib/chatStorage";
import { useAsk } from "@/hooks/useAsk";
import type { ChatMessage } from "@/lib/types";

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { ask, loading } = useAsk();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [pendingInput, setPendingInput] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    const history = chatStorage.getMessages();
    if (history.length > 0) {
      setMessages(history);
      setShowSuggestions(false);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (question: string, k: number) => {
    setError(null);
    setShowSuggestions(false);

    // Optimistically add user message to UI
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
      timestamp: Date.now(),
      k,
    };
    setMessages((prev) => [...prev, userMsg]);

    const result = await ask(question, k);

    if (result) {
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.answer,
        sources: result.sources,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } else {
      setError("Failed to get a response from the API. Make sure the FastAPI server is running.");
    }
  };

  const handleSuggestionSelect = (q: string) => {
    setPendingInput(q);
  };

  const handleClear = () => {
    chatStorage.clearHistory();
    setMessages([]);
    setShowSuggestions(true);
    setError(null);
  };

  return (
    <div className="flex h-full">
      {/* Left sidebar: suggestions */}
      <div className="w-64 border-r border-[var(--border-color)] flex flex-col overflow-y-auto flex-shrink-0">
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Quick Start
          </span>
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-red-400 transition-colors"
              title="Clear chat history"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
        <SuggestedQueries onSelect={handleSuggestionSelect} />
      </div>

      {/* Main chat area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {messages.length === 0 && showSuggestions && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-dim)] border border-[var(--border-color)] flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-[var(--accent)]" />
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">3GPP Spec Assistant</p>
                <p className="text-sm text-[var(--text-muted)] mt-1 max-w-xs">
                  Ask any question about 3GPP standards, 5G NR, LTE, or O-RAN specifications.
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessageBubble
              key={msg.id}
              message={msg}
              isStreaming={loading && i === messages.length - 1 && msg.role === "assistant"}
            />
          ))}

          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
              </div>
              <div className="flex items-center gap-1 px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                    style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
            </div>
          )}

          {error && (
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <ChatInput
          onSend={(q, k) => {
            setPendingInput(null);
            handleSend(q, k);
          }}
          disabled={loading}
        />
      </div>
    </div>
  );
}
