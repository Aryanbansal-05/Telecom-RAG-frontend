"use client";
import Link from "next/link";
import { ArrowRight, Zap, Database, Cpu, RefreshCw, AlertTriangle, Activity, Clock } from "lucide-react";
import { useApiHealth } from "@/hooks/useApiHealth";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useSystemStats } from "@/hooks/useSystemStats";
import { getSeverity, getSeverityColor } from "@/lib/types";

const FEATURES = [
  {
    href:  "/qa",
    tags:  ["Interactive", "Spec V17.0"],
    title: "3GPP Spec Q&A",
    desc:  "Query complex technical documents with semantic precision. Retrieve cross-referenced standards instantly.",
    cta:   "Open Knowledge Base",
  },
  {
    href:  "/anomalies",
    tags:  ["AI-Powered", "Live Feed"],
    title: "Anomaly Detection",
    desc:  "Real-time telemetry monitoring identifying deviant patterns in RAN performance metrics across clusters.",
    cta:   "View Live Telemetry",
  },
  {
    href:  "/rootcause",
    tags:  ["High Priority", "L4 Reasoning"],
    title: "Root Cause Analysis",
    desc:  "Automated diagnostic engine tracing faults back to protocol failures or hardware degradation.",
    cta:   "Start Diagnostics",
  },
];

export default function HomePage() {
  const health  = useApiHealth();
  const stats   = useDashboardStats();
  const sysInfo = useSystemStats();
  const apiOnline   = health.status === "ok";
  const topSeverity = stats.topAnomaly ? getSeverity(Math.abs(stats.topAnomaly.z_score)) : null;
  const topColor    = topSeverity ? getSeverityColor(topSeverity) : "var(--text-3)";

  // Build live CONFIG from /stats — fall back to labels if API is offline
  const liveConfig = [
    {
      icon: Database, label: "Knowledge Base",
      value: sysInfo.knowledgeBase.name ?? "TeleQnA",
      sub: sysInfo.knowledgeBase.documents
        ? `${sysInfo.knowledgeBase.documents.toLocaleString()} docs · ${sysInfo.knowledgeBase.faissVectors?.toLocaleString()} vectors`
        : "Loading…",
      loaded: sysInfo.knowledgeBase.documents != null,
    },
    {
      icon: Cpu, label: "Embedding Model",
      value: sysInfo.models.embeddingModel ?? "BAAI/bge-large-en",
      sub: sysInfo.models.embeddingLoaded ? "Index loaded · FAISS L2" : "Loading…",
      loaded: sysInfo.models.embeddingLoaded,
    },
    {
      icon: Zap, label: "Reasoning Engine",
      value: sysInfo.models.llmName ?? "Qwen3-4B-Instruct",
      sub: sysInfo.models.llmLoaded
        ? `${sysInfo.models.llmQuantization ?? ""} · ctx ${sysInfo.models.llmNCtx ?? 4096}`
        : "Loading…",
      loaded: sysInfo.models.llmLoaded,
    },
  ];

  return (
    <div className="w-full px-8 py-12 space-y-16 animate-[fadeIn_0.3s_ease-out]">

      {/* Hero */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-[var(--text-3)]" />
          <span className="section-label">Global Network Intelligence</span>
        </div>

        <div>
          <h1 className="text-5xl font-black leading-tight tracking-tight">
            <span style={{ color: "var(--text)" }}>Telecom RAN </span>
            <span style={{ color: "var(--cyan)" }}>Assistant</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed max-w-md" style={{ color: "var(--text-2)" }}>
            High-precision RAG interface for 5G/6G specifications and real-time
            network anomaly resolution. Engineering-grade analysis at the speed of
            thought.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/qa">
            <button className="aero-btn-primary flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              Initiate Mission
            </button>
          </Link>
          <Link href="/anomalies">
            <button className="aero-btn-outline">View Protocols</button>
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)]">
        {FEATURES.map(({ href, tags, title, desc, cta }) => (
          <Link key={href} href={href} className="group">
            <div
              className="aero-card aero-card-hover h-full p-5 flex flex-col gap-4 cursor-pointer"
              style={{ borderRadius: 0, border: "none" }}
            >
              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                {tags.map((tag, i) => (
                  <span
                    key={tag}
                    className="aero-tag"
                    style={{
                      color: i === 0 ? "var(--cyan)" : "var(--amber)",
                      borderColor: i === 0 ? "var(--cyan)" : "var(--amber)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>{title}</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>{desc}</p>
              </div>

              {/* CTA */}
              <div
                className="flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] uppercase transition-all duration-150 group-hover:gap-3"
                style={{ color: "var(--text-2)" }}
              >
                {cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Live Network Anomaly Status */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D1F2D 0%, #0D0D0D 70%)", border: "1px solid var(--border)" }}
      >
        {/* Scan line + grid */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-x-0 h-px opacity-20"
            style={{ background: "linear-gradient(90deg, transparent, var(--cyan), transparent)", animation: "scan 4s linear infinite" }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(var(--cyan) 1px,transparent 1px),linear-gradient(90deg,var(--cyan) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="relative z-10 p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          {/* Left */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" style={{ color: "var(--cyan)" }} />
              <h3 className="text-lg font-black" style={{ color: "var(--text)" }}>Network Anomaly Status</h3>
            </div>
            <p className="text-xs" style={{ color: "var(--text-2)" }}>Live scan across O-RAN telemetry. Updates on page load.</p>
            {apiOnline && !stats.loading && (
              <div className="flex items-center gap-5">
                {[{count: stats.criticalCount, label: "Critical", color: "var(--red)"}, {count: stats.highCount, label: "High", color: "var(--amber)"}, {count: stats.totalAnomalies - stats.criticalCount - stats.highCount, label: "Med/Low", color: "var(--green)"}].map(({count, label, color}) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className="status-dot" style={{ background: color }} />
                    <span className="text-xs font-bold" style={{ color }}>{count}</span>
                    <span className="section-label">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: live metrics */}
          <div className="flex items-center gap-8 flex-wrap">
            <div className="text-right">
              <p className="section-label mb-1">Total Anomalies</p>
              {stats.loading
                ? <div className="h-8 w-10 rounded animate-pulse" style={{ background: "var(--border)" }} />
                : <p className="text-3xl font-black" style={{ color: !apiOnline ? "var(--text-3)" : stats.totalAnomalies > 0 ? "var(--red)" : "var(--green)" }}>
                    {apiOnline ? stats.totalAnomalies : "—"}
                  </p>}
            </div>
            <div className="text-right">
              <p className="section-label mb-1">Peak Z-Score</p>
              {stats.loading
                ? <div className="h-8 w-14 rounded animate-pulse" style={{ background: "var(--border)" }} />
                : <p className="text-3xl font-black" style={{ color: topColor }}>
                    {apiOnline && stats.topAnomaly ? `${Math.abs(stats.topAnomaly.z_score).toFixed(1)}σ` : "—"}
                  </p>}
            </div>
            <div className="text-right">
              <p className="section-label mb-1">API Latency</p>
              {stats.loading
                ? <div className="h-8 w-16 rounded animate-pulse" style={{ background: "var(--border)" }} />
                : <p className="text-3xl font-black" style={{ color: "var(--cyan)" }}>
                    {apiOnline && stats.apiLatencyMs != null ? `${stats.apiLatencyMs}ms` : "—"}
                  </p>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={() => stats.refresh()} disabled={stats.loading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-bold tracking-[0.1em] uppercase transition-colors"
                style={{ border: "1px solid var(--border-bright)", color: "var(--text-2)", borderRadius: "2px" }}>
                <RefreshCw className={`w-3 h-3 ${stats.loading ? "animate-spin" : ""}`} />
                {stats.loading ? "Scanning…" : "Re-scan"}
              </button>
              {stats.lastScanned && (
                <div className="flex items-center gap-1" style={{ color: "var(--text-3)" }}>
                  <Clock className="w-2.5 h-2.5" />
                  <span className="text-[9px] font-mono">Last scan: {stats.lastScanned.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top anomaly strip */}
        {apiOnline && !stats.loading && stats.topAnomaly && (
          <div className="relative z-10 flex items-center gap-3 px-6 py-2" style={{ borderTop: "1px solid var(--border)" }}>
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: topColor }} />
            <span className="text-[10px] font-bold uppercase tracking-wider shrink-0" style={{ color: topColor }}>{stats.topAnomaly.metric}</span>
            <span className="text-[10px] truncate" style={{ color: "var(--text-2)" }}>{stats.topAnomaly.description}</span>
            <Link href={`/rootcause?desc=${encodeURIComponent(stats.topAnomaly.description)}`}
              className="ml-auto text-[9px] font-bold uppercase tracking-wider shrink-0 hover:underline" style={{ color: "var(--cyan)" }}>
              Analyze →
            </Link>
          </div>
        )}
        {!apiOnline && !stats.loading && (
          <div className="relative z-10 px-6 py-2 text-[9px] font-bold tracking-wider uppercase" style={{ borderTop: "1px solid var(--border)", color: "var(--text-3)" }}>
            Start the FastAPI backend on :8000 to view live network status
          </div>
        )}
      </div>

      {/* System Configuration Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="section-label">System Configuration Status</p>
          {sysInfo.uptimeHuman && (
            <span className="section-label">Uptime: {sysInfo.uptimeHuman}</span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)]">
          {liveConfig.map(({ icon: Icon, label, value, sub, loaded }) => (
            <div key={label} className="aero-card flex items-start gap-4 px-5 py-4"
              style={{ borderRadius: 0, border: "none" }}>
              <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--text-3)" }} />
              <div className="min-w-0 flex-1">
                <p className="section-label mb-0.5">{label}</p>
                <p className="text-xs font-bold tracking-wide" style={{ color: "var(--text)" }}>{value}</p>
                <p className="text-[9px] mt-0.5 font-mono" style={{ color: "var(--text-3)" }}>{sub}</p>
              </div>
              <span className="status-dot shrink-0 mt-1"
                style={{ background: !apiOnline ? "var(--text-3)" : loaded ? "var(--green)" : "var(--amber)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
