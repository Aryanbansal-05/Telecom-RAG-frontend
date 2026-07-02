"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { DEFAULT_ANOMALY_PARAMS } from "@/lib/constants";
import type { AnomalyItem } from "@/lib/types";
import { getSeverity } from "@/lib/types";

export interface DashboardStats {
  totalAnomalies: number;
  criticalCount: number;
  highCount: number;
  topAnomaly: AnomalyItem | null;
  lastScanned: Date | null;
  apiLatencyMs: number | null;
  loading: boolean;
  error: string | null;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAnomalies: 0,
    criticalCount:  0,
    highCount:      0,
    topAnomaly:     null,
    lastScanned:    null,
    apiLatencyMs:   null,
    loading:        true,
    error:          null,
  });

  const fetchStats = useCallback(async () => {
    setStats((s) => ({ ...s, loading: true, error: null }));
    const t0 = performance.now();
    try {
      const data = await api.get<AnomalyItem[]>("/anomalies", {
        folder:      DEFAULT_ANOMALY_PARAMS.folder,
        max_files:   DEFAULT_ANOMALY_PARAMS.max_files,
        z_threshold: DEFAULT_ANOMALY_PARAMS.z_threshold,
        limit:       DEFAULT_ANOMALY_PARAMS.limit,
      });
      const latency  = Math.round(performance.now() - t0);
      const critical = data.filter((a) => getSeverity(Math.abs(a.z_score)) === "critical").length;
      const high     = data.filter((a) => getSeverity(Math.abs(a.z_score)) === "high").length;
      const top      = data.reduce<AnomalyItem | null>(
        (best, cur) => (!best || Math.abs(cur.z_score) > Math.abs(best.z_score) ? cur : best),
        null
      );
      setStats({
        totalAnomalies: data.length,
        criticalCount:  critical,
        highCount:      high,
        topAnomaly:     top,
        lastScanned:    new Date(),
        apiLatencyMs:   latency,
        loading:        false,
        error:          null,
      });
    } catch (err) {
      setStats((s) => ({
        ...s,
        loading:     false,
        lastScanned: new Date(),
        error: err instanceof Error ? err.message : "Failed to fetch",
      }));
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { ...stats, refresh: fetchStats };
}
