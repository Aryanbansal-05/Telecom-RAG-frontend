"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  MessageSquare,
  AlertTriangle,
  GitBranch,
  Radio,
  Sun,
  Moon,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { useApiHealth } from "@/hooks/useApiHealth";

const NAV_ITEMS = [
  { href: "/",           icon: Activity,       label: "Dashboard" },
  { href: "/qa",         icon: MessageSquare,  label: "3GPP Q&A" },
  { href: "/anomalies",  icon: AlertTriangle,  label: "Anomaly Detection" },
  { href: "/rootcause",  icon: GitBranch,      label: "Root Cause Analysis" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const health = useApiHealth();
  const [mounted, setMounted] = useState(false);

  // Only render theme-sensitive content after hydration
  useEffect(() => setMounted(true), []);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full w-60 z-40 flex flex-col",
        "border-r border-[var(--sidebar-border)]",
        "bg-[var(--sidebar-bg)] backdrop-blur-xl"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[var(--sidebar-border)]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--accent-dim)] border border-[var(--border-color)]">
          <Radio className="w-4 h-4 text-[var(--accent)]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)] leading-none">Telecom RAG</p>
          <p className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">RAN Assistant</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          Modules
        </p>
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                active
                  ? "bg-[var(--accent-dim)] text-[var(--accent)] border border-[var(--border-color)]"
                  : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0 transition-transform duration-150 group-hover:scale-110",
                  active ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                )}
              />
              {label}
              {active && (
                <span className="ml-auto w-1 h-1 rounded-full bg-[var(--accent)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: API status + theme toggle */}
      <div className="px-4 py-4 border-t border-[var(--sidebar-border)] space-y-3">
        <StatusBadge status={health.status} />

        {/* Dark / Light toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium",
            "border border-[var(--border-color)] text-[var(--text-secondary)]",
            "hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]",
            "transition-all duration-200"
          )}
          aria-label="Toggle color theme"
        >
          {/* Render nothing theme-specific until mounted to avoid hydration mismatch */}
          {mounted ? (
            theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dark Mode</span>
              </>
            )
          ) : (
            <>
              <span className="w-3.5 h-3.5 rounded-full bg-[var(--border-color)]" />
              <span>Theme</span>
            </>
          )}
          <span className="ml-auto text-[var(--text-muted)] font-mono">⌘T</span>
        </button>

        <p className="text-[10px] text-[var(--text-muted)] font-mono text-center">
          FastAPI @ :8000
        </p>
      </div>
    </aside>
  );
}
