"use client";
import { useState } from "react";
import { ChevronDown, BookOpen, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface SourceCardProps {
  sources: string[];
}

export function SourceCard({ sources }: SourceCardProps) {
  const [open, setOpen] = useState(false);

  if (!sources.length) return null;

  return (
    <div className="mt-2 rounded-lg border border-[var(--border-color)] overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-white/5 transition-colors"
      >
        <BookOpen className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" />
        <span className="font-mono">{sources.length} source{sources.length !== 1 ? "s" : ""} cited</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 ml-auto transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="px-3 pb-3 pt-1 space-y-1.5 bg-[var(--bg-secondary)]/50 animate-fade-in">
          {sources.map((src, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-[10px] font-mono text-[var(--text-muted)] group"
            >
              <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0 text-[var(--accent)]/60" />
              <span className="line-clamp-2 group-hover:text-[var(--text-secondary)] transition-colors leading-relaxed">
                {src}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
