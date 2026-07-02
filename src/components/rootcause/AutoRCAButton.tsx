"use client";
import { Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_ANOMALY_PARAMS } from "@/lib/constants";
import type { AutoRCAParams } from "@/lib/types";

interface AutoRCAButtonProps {
  loading: boolean;
  onRun: (params: AutoRCAParams) => void;
  params?: AutoRCAParams;
}

export function AutoRCAButton({ loading, onRun, params }: AutoRCAButtonProps) {
  const STEPS = [
    "Loading telemetry CSVs…",
    "Running anomaly detection…",
    "Retrieving 3GPP context…",
    "Generating explanation…",
  ];

  return (
    <div className="space-y-3">
      <button
        onClick={() => onRun(params ?? DEFAULT_ANOMALY_PARAMS)}
        disabled={loading}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200",
          "border",
          loading
            ? "bg-purple-500/10 border-purple-500/30 text-purple-400 cursor-wait"
            : "bg-purple-500/15 border-purple-500/35 text-purple-300 hover:bg-purple-500/25 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
        )}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Zap className="w-4 h-4" />
        )}
        {loading ? "Analyzing pipeline…" : "Auto Root Cause Analysis"}
      </button>

      {/* Pipeline steps shown while loading */}
      {loading && (
        <div className="space-y-1 animate-fade-in px-1">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2 text-xs font-mono">
              <div
                className="w-1.5 h-1.5 rounded-full bg-purple-400"
                style={{ animation: `pulse 1.4s ease-in-out ${i * 0.4}s infinite` }}
              />
              <span className="text-[var(--text-muted)]">{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
