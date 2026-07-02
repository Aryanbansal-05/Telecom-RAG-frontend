"use client";
import { cn } from "@/lib/utils";

const METRIC_COLORS: Record<string, string> = {
  dl_throughput:  "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  ul_throughput:  "bg-blue-500/15 text-blue-400 border-blue-500/25",
  bler:           "bg-red-500/15 text-red-400 border-red-500/25",
  cqi:            "bg-purple-500/15 text-purple-400 border-purple-500/25",
  prb_util:       "bg-amber-500/15 text-amber-400 border-amber-500/25",
  sinr:           "bg-green-500/15 text-green-400 border-green-500/25",
};

function getMetricStyle(metric: string): string {
  const key = metric.toLowerCase().replace(/[^a-z_]/g, "");
  return METRIC_COLORS[key] ?? "bg-slate-500/15 text-slate-400 border-slate-500/25";
}

export function MetricBadge({ metric }: { metric: string }) {
  return (
    <span
      className={cn(
        "inline-block text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider",
        getMetricStyle(metric)
      )}
    >
      {metric}
    </span>
  );
}
