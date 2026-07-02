"use client";
import { BookOpen, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useState } from "react";

export function SourceList({ sources }: { sources: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? sources : sources.slice(0, 3);

  if (!sources.length) return null;

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2">
        <BookOpen className="w-3.5 h-3.5 text-[var(--accent)]" />
        <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          Retrieved Sources ({sources.length})
        </h4>
      </div>
      <div className="space-y-1.5">
        {visible.map((src, i) => (
          <div
            key={i}
            className="flex items-start gap-2 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--border-hover)] transition-colors animate-fade-in"
          >
            <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0 text-[var(--accent)]/60" />
            <p className="text-[10px] font-mono text-[var(--text-muted)] leading-relaxed">{src}</p>
          </div>
        ))}
      </div>
      {sources.length > 3 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1 text-xs text-[var(--accent)] hover:underline"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" /> Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" /> Show {sources.length - 3} more
            </>
          )}
        </button>
      )}
    </div>
  );
}
