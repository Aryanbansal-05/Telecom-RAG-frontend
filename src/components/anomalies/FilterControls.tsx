"use client";
import { RefreshCw, Settings2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ANOMALY_FOLDERS, DEFAULT_ANOMALY_PARAMS } from "@/lib/constants";
import type { AnomalyQueryParams } from "@/lib/types";

interface FilterControlsProps {
  params: AnomalyQueryParams;
  onParamsChange: (p: AnomalyQueryParams) => void;
  onRefresh: () => void;
  loading: boolean;
  countdown: number;
  lastFetched: Date | null;
}

export function FilterControls({
  params,
  onParamsChange,
  onRefresh,
  loading,
  countdown,
  lastFetched,
}: FilterControlsProps) {
  const [open, setOpen] = useState(false);

  const pct = ((countdown / 60) * 100).toFixed(1);

  return (
    <div className="space-y-2">
      {/* Top row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Folder selector */}
        <div className="relative">
          <select
            value={params.folder}
            onChange={(e) => onParamsChange({ ...params, folder: e.target.value })}
            className={cn(
              "appearance-none pl-3 pr-8 py-2 rounded-lg text-xs font-mono",
              "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)]",
              "hover:border-[var(--border-hover)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            )}
          >
            {ANOMALY_FOLDERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" />
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono border transition-all",
            open
              ? "bg-[var(--accent-dim)] border-[var(--border-hover)] text-[var(--accent)]"
              : "bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          )}
        >
          <Settings2 className="w-3.5 h-3.5" />
          Advanced
        </button>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--accent)] transition-all disabled:opacity-50"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          {loading ? "Scanning…" : "Refresh"}
        </button>

        {/* Auto-refresh countdown */}
        <div className="ml-auto flex flex-col items-end gap-0.5">
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            Auto-refresh in {countdown}s
          </span>
          <div className="w-32 h-0.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] rounded-full transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          {lastFetched && (
            <span className="text-[9px] font-mono text-[var(--text-muted)]">
              Last: {lastFetched.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          )}
        </div>
      </div>

      {/* Advanced panel */}
      {open && (
        <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] animate-fade-in">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Z-Threshold</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={2}
                max={6}
                step={0.5}
                value={params.z_threshold ?? DEFAULT_ANOMALY_PARAMS.z_threshold}
                onChange={(e) => onParamsChange({ ...params, z_threshold: Number(e.target.value) })}
                className="w-28 accent-[var(--accent)]"
              />
              <span className="text-xs font-mono text-[var(--accent)] w-8">
                {params.z_threshold ?? DEFAULT_ANOMALY_PARAMS.z_threshold}σ
              </span>
            </div>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Max Files</span>
            <input
              type="number"
              min={1}
              max={100}
              value={params.max_files ?? DEFAULT_ANOMALY_PARAMS.max_files}
              onChange={(e) => onParamsChange({ ...params, max_files: Number(e.target.value) })}
              className="w-20 px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Result Limit</span>
            <input
              type="number"
              min={1}
              max={50}
              value={params.limit ?? DEFAULT_ANOMALY_PARAMS.limit}
              onChange={(e) => onParamsChange({ ...params, limit: Number(e.target.value) })}
              className="w-20 px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </label>
        </div>
      )}
    </div>
  );
}
