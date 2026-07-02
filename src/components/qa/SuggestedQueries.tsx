"use client";
import { Zap } from "lucide-react";
import { SUGGESTED_QUERIES } from "@/lib/constants";

interface SuggestedQueriesProps {
  onSelect: (q: string) => void;
}

export function SuggestedQueries({ onSelect }: SuggestedQueriesProps) {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-2">
        <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          Suggested Questions
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        {SUGGESTED_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="text-left text-xs px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-dim)] border border-transparent hover:border-[var(--border-color)] transition-all duration-150 font-mono leading-relaxed"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
