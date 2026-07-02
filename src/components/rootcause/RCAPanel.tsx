"use client";
import { useState } from "react";
import { Search, X, Loader2, GitBranch, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ExplanationCard } from "./ExplanationCard";
import { AutoRCAButton } from "./AutoRCAButton";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useRootCause } from "@/hooks/useRootCause";
import { useAutoRCA } from "@/hooks/useAutoRCA";
import { RCA_EXAMPLE_DESCRIPTIONS } from "@/lib/constants";

interface RCAPanelProps {
  initialDescription?: string;
}

export function RCAPanel({ initialDescription }: RCAPanelProps) {
  const [description, setDescription] = useState(initialDescription ?? "");
  const [mode, setMode] = useState<"manual" | "auto">("manual");
  const manual = useRootCause();
  const auto = useAutoRCA();

  const handleManualAnalyze = async () => {
    if (!description.trim()) return;
    await manual.analyze(description.trim());
  };

  const handleAutoRCA = async () => {
    setMode("auto");
    manual.reset();
    await auto.runAuto();
  };

  const activeResult = mode === "manual" ? manual.data : auto.data;
  const activeError = mode === "manual" ? manual.error : auto.error;
  const activeLoading = mode === "manual" ? manual.loading : auto.loading;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-full">
      {/* Left: Input panel */}
      <div className="space-y-4">
        {/* Mode tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          {(["manual", "auto"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); manual.reset(); auto.reset(); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === m
                  ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm border border-[var(--border-color)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {m === "manual" ? <Search className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
              {m === "manual" ? "Manual Analysis" : "Auto Analysis"}
            </button>
          ))}
        </div>

        {/* Manual input */}
        {mode === "manual" && (
          <div className="space-y-3">
            <GlassCard className="p-1">
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the fault or anomaly…&#10;&#10;e.g. High BLER observed on PUSCH channel — uplink interference suspected"
                  rows={5}
                  className="w-full bg-transparent px-4 py-3 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none resize-none"
                />
                {description && (
                  <button
                    onClick={() => { setDescription(""); manual.reset(); }}
                    className="absolute top-3 right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </GlassCard>

            <button
              onClick={handleManualAnalyze}
              disabled={!description.trim() || manual.loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-semibold text-sm bg-[var(--accent-dim)] border border-[var(--border-hover)] text-[var(--accent)] hover:bg-[var(--accent)]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              {manual.loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <GitBranch className="w-4 h-4" />
              )}
              {manual.loading ? "Analyzing…" : "Analyze Root Cause"}
            </button>

            {/* Example descriptions */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider px-1">
                Examples
              </p>
              {RCA_EXAMPLE_DESCRIPTIONS.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setDescription(ex)}
                  className="w-full text-left text-xs px-3 py-2 rounded-lg border border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:border-[var(--border-color)] transition-all font-mono leading-relaxed"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Auto RCA */}
        {mode === "auto" && (
          <div className="space-y-3">
            <GlassCard className="p-4">
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Auto mode chains anomaly detection with root cause analysis in a single API call.
                It scans the telemetry folder, picks the highest-severity anomaly, and generates
                an explanation grounded in 3GPP standards.
              </p>
            </GlassCard>
            <AutoRCAButton loading={auto.loading} onRun={handleAutoRCA} />
          </div>
        )}
      </div>

      {/* Right: Result panel */}
      <div className="space-y-3">
        {activeLoading && (
          <GlassCard className="p-8 flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin" />
            <p className="text-sm text-[var(--text-secondary)]">
              {mode === "auto" ? "Running pipeline…" : "Retrieving context…"}
            </p>
          </GlassCard>
        )}

        {activeError && !activeLoading && (
          <ErrorBanner message={activeError} />
        )}

        {activeResult && !activeLoading && (
          <ExplanationCard
            result={activeResult}
            description={mode === "manual" ? description : "Auto-detected anomaly"}
          />
        )}

        {!activeResult && !activeLoading && !activeError && (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center py-16 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-[var(--accent-dim)] border border-[var(--border-color)] flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <p className="font-semibold text-[var(--text-primary)]">
              {mode === "manual" ? "Enter a fault description" : "Click Auto Analysis to begin"}
            </p>
            <p className="text-xs text-[var(--text-muted)] max-w-xs">
              {mode === "manual"
                ? "The RAG pipeline will retrieve relevant 3GPP context and explain the likely root cause."
                : "The system will automatically detect the top anomaly from telemetry and explain it."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
