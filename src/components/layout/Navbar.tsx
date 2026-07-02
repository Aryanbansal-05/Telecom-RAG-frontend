"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useApiHealth } from "@/hooks/useApiHealth";

const NAV = [
  { href: "/",          label: "Dashboard" },
  { href: "/qa",        label: "3GPP Q&A" },
  { href: "/anomalies", label: "Anomaly Detection" },
  { href: "/rootcause", label: "Root Cause Analysis" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const health = useApiHealth();

  useEffect(() => setMounted(true), []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      style={{ borderBottom: "1px solid var(--border)" }}
      className="sticky top-0 z-50 bg-[var(--bg)] flex items-center h-12 px-6 gap-8"
    >
      {/* Logo */}
      <Link
        href="/"
        className="text-[var(--cyan)] font-black text-sm tracking-[0.15em] uppercase shrink-0 hover:opacity-80 transition-opacity"
      >
        AERO-COMMS
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-6 flex-1">
        {NAV.map(({ href, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="relative text-[10px] font-bold tracking-[0.12em] uppercase transition-colors"
              style={{ color: active ? "var(--text)" : "var(--text-2)" }}
            >
              {label}
              {active && (
                <span
                  className="absolute -bottom-[13px] left-0 right-0 h-[1px]"
                  style={{ background: "var(--cyan)" }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right: theme toggle + API status */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Theme toggle */}
        <button
          onClick={() => mounted && setTheme(theme === "dark" ? "light" : "dark")}
          className="p-1.5 transition-colors hover:text-[var(--cyan)]"
          style={{ color: "var(--text-2)" }}
          aria-label="Toggle theme"
        >
          {mounted && theme === "light"
            ? <Moon className="w-3.5 h-3.5" />
            : <Sun className="w-3.5 h-3.5" />
          }
        </button>

        {/* API badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold tracking-[0.1em] uppercase"
          style={{
            border: `1px solid ${health.status === "ok" ? "var(--cyan)" : "var(--red)"}`,
            color:  health.status === "ok" ? "var(--cyan)" : "var(--red)",
            borderRadius: "2px",
          }}
        >
          <span
            className="status-dot"
            style={{ background: health.status === "ok" ? "var(--green)" : "var(--red)" }}
          />
          {health.status === "ok" ? "API Online" : health.status === "loading" ? "Connecting…" : "API Offline"}
        </div>
      </div>
    </nav>
  );
}
