"use client";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { CopyButton } from "@/components/ui/CopyButton";
import { SourceCard } from "./SourceCard";
import { User, Bot } from "lucide-react";
import type { ChatMessage } from "@/lib/types";

interface ChatMessageProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function ChatMessageBubble({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
          isUser
            ? "bg-[var(--accent-dim)] border border-[var(--border-color)]"
            : "bg-purple-500/15 border border-purple-500/25"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-[var(--accent)]" />
        ) : (
          <Bot className="w-4 h-4 text-purple-400" />
        )}
      </div>

      {/* Bubble */}
      <div className={cn("flex flex-col max-w-[80%]", isUser && "items-end")}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            {isUser ? "You" : "RAN Assistant"}
          </span>
          <span className="text-[10px] text-[var(--text-muted)]">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {!isUser && <CopyButton text={message.content} />}
        </div>

        <div
          className={cn(
            "px-4 py-3 rounded-xl text-sm leading-relaxed",
            isUser
              ? "bg-[var(--accent-dim)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-xs"
              : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)]"
          )}
        >
          {isUser ? (
            message.content
          ) : (
            <div className={cn(isStreaming && "typewriter-cursor")}>
              <MarkdownRenderer content={message.content} />
            </div>
          )}
        </div>

        {/* Sources for assistant */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="w-full mt-1">
            <SourceCard sources={message.sources} />
          </div>
        )}
      </div>
    </div>
  );
}
