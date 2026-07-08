"use client";
import { useState, useCallback } from "react";
import { AlertTriangle, LayoutGrid, Table2, Bell, Network, Search, ExternalLink, MessageSquare } from "lucide-react";
import { AnomalyCard } from "./AnomalyCard";
import { FilterControls } from "./FilterControls";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useAnomalies } from "@/hooks/useAnomalies";
import { useAlarms, AlarmRecord } from "@/hooks/useAlarms";
import { useNetworkElements } from "@/hooks/useNetworkElements";
import { DEFAULT_ANOMALY_PARAMS } from "@/lib/constants";
import { translateAuto, ALARM_TITLE_MAP, ALARM_LEVEL_MAP, CITY_MAP, VENDOR_MAP, SITE_MAP } from "@/lib/translations";
import type { AnomalyQueryParams } from "@/lib/types";
import { getSeverity, getSeverityColor } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "anomalies" | "alarms" | "network";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "anomalies", label: "O-RAN Anomalies",  icon: AlertTriangle },
  { id: "alarms",    label: "5G Alarms",         icon: Bell },
  { id: "network",   label: "Network Elements",  icon: Network },
];

// ── Alarm severity colour (works on raw Chinese or translated English) ────────
function severityColor(level: string): string {
  const l = translateAuto(level).toLowerCase();
  if (/critical|l1/.test(l))  return "var(--red, #ef4444)";
  if (/major|l2/.test(l))     return "var(--amber, #f59e0b)";
  if (/minor|l3/.test(l))     return "var(--cyan, #22d3ee)";
  if (/warning|l4/.test(l))   return "var(--text-2)";
  return "var(--text-3)";
}

// ── Alarm action buttons ────────────────────────────────────────────────────
function AlarmActions({ alarm }: { alarm: AlarmRecord }) {
  const titleEn = translateAuto(alarm.alarm_title);
  const levelEn = translateAuto(alarm.alarm_level);
  const desc = [titleEn, alarm.ne_name, levelEn ? `Level: ${levelEn}` : ""]
    .filter(Boolean).join(" | ");
  return (
    <div className="flex items-center gap-2">
      <a
        href={`/rootcause?desc=${encodeURIComponent(desc)}`}
        className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-colors"
        title="Run AI root cause analysis on this alarm"
      >
        <ExternalLink className="w-3 h-3" /> RCA
      </a>
      <a
        href={`/qa?q=${encodeURIComponent(`What could cause: ${alarm.alarm_title}?`)}`}
        className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide bg-[var(--surface)] text-[var(--text-2)] hover:text-[var(--cyan)] border border-[var(--border)] transition-colors"
        title="Ask the 3GPP spec assistant about this alarm"
      >
        <MessageSquare className="w-3 h-3" /> Ask AI
      </a>
    </div>
  );
}

export function AnomalyDashboard() {
  const [tab, setTab]           = useState<Tab>("anomalies");
  const [params, setParams]     = useState<AnomalyQueryParams>(DEFAULT_ANOMALY_PARAMS);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Alarm filters
  const [alarmSearch,  setAlarmSearch]  = useState("");
  const [alarmCity,    setAlarmCity]    = useState("");
  const [alarmVendor,  setAlarmVendor]  = useState("");
  const [alarmPage,    setAlarmPage]    = useState(1);
  const PAGE_SIZE = 15;

  // NE filters
  const [neSearch, setNeSearch] = useState("");

  // Hooks
  const { data, loading, error, lastFetched, countdown, refresh } = useAnomalies(params);
  const alarms  = useAlarms({ limit: 200 });   // fetch a bigger batch for client-side filter
  const network = useNetworkElements();

  // ── Client-side alarm filtering ─────────────────────────────────────────
  const filteredAlarms = alarms.data.filter((a) => {
    const title  = (a.alarm_title || "").toLowerCase();
    const ne     = (a.ne_name    || "").toLowerCase();
    const city   = (a.city       || "").toLowerCase();
    const vendor = (a.vendor     || "").toLowerCase();
    const q = alarmSearch.toLowerCase();
    return (
      (!q || title.includes(q) || ne.includes(q)) &&
      (!alarmCity   || city.includes(alarmCity.toLowerCase())) &&
      (!alarmVendor || vendor.includes(alarmVendor.toLowerCase()))
    );
  });
  const pagedAlarms    = filteredAlarms.slice((alarmPage - 1) * PAGE_SIZE, alarmPage * PAGE_SIZE);
  const totalPages     = Math.ceil(filteredAlarms.length / PAGE_SIZE);

  // ── Client-side NE filtering ─────────────────────────────────────────────
  const filteredNEs = network.data.filter((ne) => {
    const q = neSearch.toLowerCase();
    return !q || (ne.ne_name || "").toLowerCase().includes(q) ||
                 (ne.vendor  || "").toLowerCase().includes(q) ||
                 (ne.ne_type || "").toLowerCase().includes(q);
  });

  const handleParamsChange = (newParams: AnomalyQueryParams) => {
    setParams(newParams);
    refresh(newParams);
  };

  // Reset page when filters change
  const handleAlarmSearch = useCallback((v: string) => { setAlarmSearch(v); setAlarmPage(1); }, []);
  const handleAlarmCity   = useCallback((v: string) => { setAlarmCity(v);   setAlarmPage(1); }, []);
  const handleAlarmVendor = useCallback((v: string) => { setAlarmVendor(v); setAlarmPage(1); }, []);

  return (
    <div className="space-y-5">

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-[var(--border)]">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wide uppercase transition-colors border-b-2 -mb-px",
              tab === id
                ? "border-[var(--cyan)] text-[var(--cyan)]"
                : "border-transparent text-[var(--text-3)] hover:text-[var(--text-2)]"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {id === "alarms" && !alarms.loading && (
              <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] bg-amber-500/15 text-amber-400 font-mono">
                {alarms.total.toLocaleString()}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── O-RAN Anomalies ── */}
      {tab === "anomalies" && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h2 className="font-semibold text-[var(--text)]">
                  {loading ? "Scanning…" : `${data.length} anomal${data.length !== 1 ? "ies" : "y"} detected`}
                </h2>
                <p className="text-xs text-[var(--text-3)] font-mono">
                  Folder: {params.folder} · Z-threshold: {params.z_threshold}σ
                </p>
              </div>
            </div>
            <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
              {([ ["grid", LayoutGrid], ["table", Table2] ] as const).map(([mode, Icon]) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-colors",
                    viewMode === mode ? "bg-[var(--surface)] text-[var(--cyan)]"
                                     : "text-[var(--text-3)] hover:text-[var(--text)] hover:bg-white/5"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />{mode}
                </button>
              ))}
            </div>
          </div>

          <FilterControls params={params} onParamsChange={handleParamsChange}
            onRefresh={() => refresh(params)} loading={loading}
            countdown={countdown} lastFetched={lastFetched} />

          {error && <ErrorBanner message={error} />}

          {loading && data.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-52 rounded-xl shimmer border border-[var(--border)]" />
              ))}
            </div>
          )}

          {!loading && viewMode === "grid" && data.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {data.map((anomaly, i) => (
                <AnomalyCard key={`${anomaly.source_file}-${anomaly.metric}-${i}`} anomaly={anomaly} />
              ))}
            </div>
          )}

          {!loading && viewMode === "table" && data.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] overflow-hidden animate-fade-in">
              <table className="w-full text-xs font-mono">
                <thead className="bg-[var(--surface)]">
                  <tr>
                    {["Metric", "Value", "Z-Score", "Severity", "Source File", "Action"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[var(--text-3)] font-semibold uppercase tracking-wider text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {data.map((a, i) => {
                    const severity = getSeverity(Math.abs(a.z_score));
                    const color    = getSeverityColor(severity);
                    return (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 text-[var(--cyan)]">{a.metric}</td>
                        <td className="px-4 py-3 text-[var(--text)]">{a.value.toFixed(4)}</td>
                        <td className="px-4 py-3" style={{ color }}>{Math.abs(a.z_score).toFixed(2)}σ</td>
                        <td className="px-4 py-3"><span className="uppercase text-[10px] font-semibold" style={{ color }}>{severity}</span></td>
                        <td className="px-4 py-3 text-[var(--text-3)] truncate max-w-[160px]">{a.source_file.split("/").pop()}</td>
                        <td className="px-4 py-3">
                          <a href={`/rootcause?desc=${encodeURIComponent(a.description)}`}
                            className="text-[var(--cyan)] hover:underline text-[10px]">Analyze →</a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && data.length === 0 && !error && (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-green-400" />
              </div>
              <p className="font-semibold text-[var(--text)]">No Anomalies Detected</p>
              <p className="text-sm text-[var(--text-3)] mt-1">Network metrics are within normal ranges at the current threshold.</p>
            </div>
          )}
        </>
      )}

      {/* ── 5G Alarms ── */}
      {tab === "alarms" && (
        <div className="space-y-4">

          {/* Header + context */}
          <div>
            <h2 className="font-semibold text-[var(--text)]">
              {alarms.loading ? "Loading alarms…"
                : `Showing ${pagedAlarms.length} of ${filteredAlarms.length} matching alarms`}
            </h2>
            <p className="text-xs text-[var(--text-3)] font-mono mt-0.5">
              Click <strong className="text-amber-400">RCA</strong> to run AI root cause analysis, or <strong className="text-[var(--cyan)]">Ask AI</strong> to query the 3GPP knowledge base.
            </p>
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex-1 min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-[var(--text-3)] flex-shrink-0" />
              <input
                type="text" value={alarmSearch}
                onChange={(e) => handleAlarmSearch(e.target.value)}
                placeholder="Search alarm title or NE…"
                className="bg-transparent text-xs text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none flex-1"
              />
            </div>
            <input type="text" value={alarmCity}
              onChange={(e) => handleAlarmCity(e.target.value)}
              placeholder="City…"
              className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none w-28"
            />
            <input type="text" value={alarmVendor}
              onChange={(e) => handleAlarmVendor(e.target.value)}
              placeholder="Vendor…"
              className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none w-28"
            />
          </div>

          {alarms.error && <ErrorBanner message={alarms.error} />}

          {alarms.loading ? (
            <div className="space-y-2 animate-pulse">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-[var(--border)] opacity-40" />
              ))}
            </div>
          ) : pagedAlarms.length === 0 ? (
            <div className="text-center py-16 text-[var(--text-3)] text-sm">
              No alarms match your filters.
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-xs font-mono">
                <thead className="bg-[var(--surface)]">
                  <tr>
                    {["Alarm Title", "Network Element", "Time", "Level", "City", "Action"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[var(--text-3)] font-semibold uppercase tracking-wider text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {pagedAlarms.map((a, i) => {
                    const lvl = translateAuto(a.alarm_level);
                    const col = severityColor(a.alarm_level);
                    return (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-4 py-2.5 text-[var(--text)] max-w-[220px]" title={translateAuto(a.alarm_title)}>
                          <span className="truncate block">{translateAuto(a.alarm_title)}</span>
                        </td>
                        <td className="px-4 py-2.5 text-[var(--cyan)] max-w-[180px] truncate" title={a.ne_name}>
                          {a.ne_name || "—"}
                        </td>
                        <td className="px-4 py-2.5 text-[var(--text-3)]">{a.alarm_time || "—"}</td>
                        <td className="px-4 py-2.5 font-semibold" style={{ color: col }}>{lvl}</td>
                        <td className="px-4 py-2.5 text-[var(--text-2)]">{translateAuto(a.city)}</td>
                        <td className="px-4 py-2.5">
                          <AlarmActions alarm={a} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-3)]">
              <span>Page {alarmPage} of {totalPages}</span>
              <div className="flex gap-2">
                <button onClick={() => setAlarmPage((p) => Math.max(1, p - 1))} disabled={alarmPage === 1}
                  className="px-3 py-1 rounded border border-[var(--border)] hover:border-[var(--cyan)] disabled:opacity-30 transition-colors">
                  ← Prev
                </button>
                <button onClick={() => setAlarmPage((p) => Math.min(totalPages, p + 1))} disabled={alarmPage === totalPages}
                  className="px-3 py-1 rounded border border-[var(--border)] hover:border-[var(--cyan)] disabled:opacity-30 transition-colors">
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Network Elements ── */}
      {tab === "network" && (
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold text-[var(--text)]">
              {network.loading ? "Loading…" : `${filteredNEs.length} network elements`}
            </h2>
            <p className="text-xs text-[var(--text-3)] font-mono mt-0.5">
              Device inventory — click an NE name to filter alarms for that element.
            </p>
          </div>

          {/* NE search */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] max-w-xs">
            <Search className="w-3.5 h-3.5 text-[var(--text-3)] flex-shrink-0" />
            <input type="text" value={neSearch}
              onChange={(e) => setNeSearch(e.target.value)}
              placeholder="Search by name, vendor, type…"
              className="bg-transparent text-xs text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none flex-1"
            />
          </div>

          {network.error && <ErrorBanner message={network.error} />}

          {network.loading ? (
            <div className="space-y-2 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-[var(--border)] opacity-40" />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-xs font-mono">
                <thead className="bg-[var(--surface)]">
                  <tr>
                    {["NE Name", "Alias", "Type", "Model", "Site", "Vendor", "Service", "Alarms"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[var(--text-3)] font-semibold uppercase tracking-wider text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredNEs.map((ne, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-2.5 text-[var(--cyan)] max-w-[160px] truncate" title={ne.ne_name}>{ne.ne_name || "—"}</td>
                      <td className="px-4 py-2.5 text-[var(--text-2)]">{ne.ne_alias || "—"}</td>
                      <td className="px-4 py-2.5 text-[var(--text)]">{ne.ne_type || "—"}</td>
                      <td className="px-4 py-2.5 text-[var(--text-2)]">{ne.ne_model || "—"}</td>
                      <td className="px-4 py-2.5 text-[var(--text-3)]">{translateAuto(String(ne.site))}</td>
                      <td className="px-4 py-2.5 text-[var(--text-2)]">{translateAuto(String(ne.vendor))}</td>
                      <td className="px-4 py-2.5 text-[var(--text-3)]">{ne.affected_service || "—"}</td>
                      <td className="px-4 py-2.5">
                        {/* Jump to alarms filtered by this NE */}
                        <button
                          onClick={() => { setAlarmSearch(ne.ne_name || ""); setTab("alarms"); }}
                          className="text-[10px] font-bold text-amber-400 hover:underline uppercase tracking-wide"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
