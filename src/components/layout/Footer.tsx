"use client";
import { useApiHealth } from "@/hooks/useApiHealth";

const APP_VERSION = "0.1.0"; // from package.json

export function Footer() {
  const health = useApiHealth();
  const online = health.status === "ok";
  const loading = health.status === "loading";

  return (
    <footer
      className="flex items-center justify-between px-6 h-9 text-[9px] font-bold tracking-[0.12em] uppercase shrink-0"
      style={{ borderTop: "1px solid var(--border)", color: "var(--text-3)" }}
    >
      {/* Left: version */}
      <span>AERO-COMMS v{APP_VERSION}</span>

      {/* Centre: live status */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span
            className="status-dot"
            style={{
              background: loading ? "var(--amber)" : online ? "var(--green)" : "var(--red)",
            }}
          />
          {loading
            ? "Server Status: Connecting…"
            : online
            ? "Server Status: Online"
            : "Server Status: Offline"}
        </span>

        <span className="flex items-center gap-1.5">
          <span
            className="status-dot"
            style={{
              background: loading ? "var(--amber)" : online ? "var(--cyan)" : "var(--red)",
            }}
          />
          {online
            ? `Uplink: Active${health.responseMs != null ? ` · ${health.responseMs}ms` : ""}`
            : loading
            ? "Uplink: Connecting…"
            : "Uplink: Disconnected"}
        </span>
      </div>

      {/* Right: links */}
      <div className="flex items-center gap-4">
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--text-2)] transition-colors"
          style={{ pointerEvents: online ? "auto" : "none", opacity: online ? 1 : 0.4 }}
        >
          API Docs
        </a>
        <span className="hover:text-[var(--text-2)] cursor-pointer transition-colors">Security</span>
      </div>
    </footer>
  );
}
