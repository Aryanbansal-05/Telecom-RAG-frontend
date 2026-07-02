"use client";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const PAGE_TITLES: Record<string, { title: string; description: string }> = {
  "/":           { title: "Dashboard",             description: "System overview & quick access" },
  "/qa":         { title: "3GPP Spec Q&A",         description: "Ask questions grounded in TeleQnA standards" },
  "/anomalies":  { title: "Anomaly Detection",     description: "O-RAN telemetry analysis with z-score detection" },
  "/rootcause":  { title: "Root Cause Analysis",   description: "Explain faults & anomalies using RAG pipeline" },
};

export function TopBar() {
  const pathname = usePathname();
  const page = PAGE_TITLES[pathname] ?? PAGE_TITLES["/"];

  return (
    <header className="h-14 flex items-center px-6 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[var(--text-muted)] font-mono text-xs">TELECOM RAG</span>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        <span className="text-[var(--text-primary)] font-semibold">{page.title}</span>
      </div>
      <p className="ml-auto text-xs text-[var(--text-muted)] hidden md:block font-mono">
        {page.description}
      </p>
    </header>
  );
}
