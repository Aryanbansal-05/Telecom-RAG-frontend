"use client";
import { useRouter } from "next/navigation";
import { FileText, GitBranch, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ZScoreGauge } from "./ZScoreGauge";
import { MetricBadge } from "./MetricBadge";
import { getSeverity } from "@/lib/types";
import type { AnomalyItem } from "@/lib/types";

interface AnomalyCardProps {
  anomaly: AnomalyItem;
}

export function AnomalyCard({ anomaly }: AnomalyCardProps) {
  const router = useRouter();
  const severity = getSeverity(Math.abs(anomaly.z_score));

  const handleAnalyze = () => {
    const encoded = encodeURIComponent(anomaly.description);
    router.push(`/rootcause?desc=${encoded}`);
  };

  return (
    <GlassCard
      severity={severity === "low" ? "normal" : severity}
      className={`p-4 space-y-3 ${severity === "critical" ? "animate-pulse-fast" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <MetricBadge metric={anomaly.metric} />
        <ZScoreGauge zScore={anomaly.z_score} size={52} />
      </div>

      {/* Value */}
      <div>
        <span className="text-2xl font-mono font-bold text-[var(--text-primary)]">
          {anomaly.value.toFixed(3)}
        </span>
        <span className="text-xs text-[var(--text-muted)] ml-1">raw value</span>
      </div>

      {/* Description */}
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
        {anomaly.description}
      </p>

      {/* Source file & time */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)]">
          <FileText className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{anomaly.source_file.split("/").pop()}</span>
        </div>
        {anomaly.time !== null && (
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)]">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span>t = {anomaly.time}</span>
          </div>
        )}
      </div>

      {/* Action */}
      <button
        onClick={handleAnalyze}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--accent)] transition-all duration-150"
      >
        <GitBranch className="w-3.5 h-3.5" />
        Analyze Root Cause
      </button>
    </GlassCard>
  );
}
