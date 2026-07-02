"use client";
import { cn } from "@/lib/utils";

type Status = "ok" | "error" | "loading";

const config: Record<Status, { color: string; label: string }> = {
  ok:      { color: "bg-green-500",  label: "API Online" },
  error:   { color: "bg-red-500",    label: "API Offline" },
  loading: { color: "bg-amber-400",  label: "Connecting…" },
};

export function StatusBadge({ status }: { status: Status }) {
  const { color, label } = config[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
      <span className={cn("w-2 h-2 rounded-full", color, status === "ok" && "animate-pulse")} />
      <span className={status === "error" ? "text-red-400" : status === "ok" ? "text-green-400" : "text-amber-400"}>
        {label}
      </span>
    </span>
  );
}
