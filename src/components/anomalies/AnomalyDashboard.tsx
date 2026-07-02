"use client";
import { useState } from "react";
import { AlertTriangle, LayoutGrid, Table2 } from "lucide-react";
import { AnomalyCard } from "./AnomalyCard";
import { FilterControls } from "./FilterControls";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useAnomalies } from "@/hooks/useAnomalies";
import { DEFAULT_ANOMALY_PARAMS } from "@/lib/constants";
import type { AnomalyQueryParams } from "@/lib/types";
import { getSeverity, getSeverityColor } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AnomalyDashboard() {
  const [params, setParams] = useState<AnomalyQueryParams>(DEFAULT_ANOMALY_PARAMS);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const { data, loading, error, lastFetched, countdown, refresh } = useAnomalies(params);

  const handleParamsChange = (newParams: AnomalyQueryParams) => {
    setParams(newParams);
    refresh(newParams);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">
              {loading ? "Scanning…" : `${data.length} anomal${data.length !== 1 ? "ies" : "y"} detected`}
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono">folder: {params.folder}</p>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex rounded-lg border border-[var(--border-color)] overflow-hidden">
          {([["grid", LayoutGrid], ["table", Table2]] as const).map(([mode, Icon]) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-colors",
                viewMode === mode
                  ? "bg-[var(--accent-dim)] text-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Filter controls */}
      <FilterControls
        params={params}
        onParamsChange={handleParamsChange}
        onRefresh={() => refresh(params)}
        loading={loading}
        countdown={countdown}
        lastFetched={lastFetched}
      />

      {/* Error */}
      {error && <ErrorBanner message={error} />}

      {/* Loading skeletons */}
      {loading && data.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 rounded-xl shimmer border border-[var(--border-color)]" />
          ))}
        </div>
      )}

      {/* Grid view */}
      {!loading && viewMode === "grid" && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {data.map((anomaly, i) => (
            <AnomalyCard key={`${anomaly.source_file}-${anomaly.metric}-${i}`} anomaly={anomaly} />
          ))}
        </div>
      )}

      {/* Table view */}
      {!loading && viewMode === "table" && data.length > 0 && (
        <div className="rounded-xl border border-[var(--border-color)] overflow-hidden animate-fade-in">
          <table className="w-full text-xs font-mono">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                {["Metric", "Value", "Z-Score", "Severity", "Source File", "Action"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[var(--text-muted)] font-semibold uppercase tracking-wider text-[10px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {data.map((a, i) => {
                const severity = getSeverity(Math.abs(a.z_score));
                const color = getSeverityColor(severity);
                return (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-[var(--accent)]">{a.metric}</td>
                    <td className="px-4 py-3 text-[var(--text-primary)]">{a.value.toFixed(4)}</td>
                    <td className="px-4 py-3" style={{ color }}>{Math.abs(a.z_score).toFixed(2)}σ</td>
                    <td className="px-4 py-3">
                      <span className="uppercase text-[10px] font-semibold" style={{ color }}>{severity}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-muted)] truncate max-w-[160px]">
                      {a.source_file.split("/").pop()}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/rootcause?desc=${encodeURIComponent(a.description)}`}
                        className="text-[var(--accent)] hover:underline text-[10px]"
                      >
                        Analyze →
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {!loading && data.length === 0 && !error && (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-green-400" />
          </div>
          <p className="font-semibold text-[var(--text-primary)]">No Anomalies Detected</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">Network metrics are within normal ranges at the current threshold.</p>
        </div>
      )}
    </div>
  );
}
