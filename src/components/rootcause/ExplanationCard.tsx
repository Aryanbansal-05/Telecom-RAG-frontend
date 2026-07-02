"use client";
import { GitBranch } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { CopyButton } from "@/components/ui/CopyButton";
import { SourceList } from "./SourceList";
import type { RootCauseResponse } from "@/lib/types";

interface ExplanationCardProps {
  result: RootCauseResponse;
  description: string;
}

export function ExplanationCard({ result, description }: ExplanationCardProps) {
  return (
    <GlassCard className="p-5 space-y-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-start gap-3 pb-3 border-b border-[var(--border-color)]">
        <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center flex-shrink-0">
          <GitBranch className="w-4 h-4 text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-sm text-[var(--text-primary)]">Root Cause Explanation</h3>
            <CopyButton text={result.explanation} />
          </div>
          <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5 line-clamp-1">{description}</p>
        </div>
      </div>

      {/* Explanation */}
      <MarkdownRenderer content={result.explanation} />

      {/* Sources */}
      <SourceList sources={result.sources} />
    </GlassCard>
  );
}
