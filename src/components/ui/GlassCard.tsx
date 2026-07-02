"use client";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  severity?: "critical" | "high" | "medium" | "normal";
}

const severityBorder: Record<string, string> = {
  critical: "border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.15)]",
  high: "border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.12)]",
  medium: "border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]",
  normal: "",
};

export function GlassCard({
  children,
  className,
  hover = false,
  onClick,
  severity = "normal",
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-card relative overflow-hidden",
        severityBorder[severity],
        hover && "cursor-pointer transition-all duration-200 hover:-translate-y-0.5",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
