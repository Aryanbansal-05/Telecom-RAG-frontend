"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { AUTO_REFRESH_INTERVAL_MS, DEFAULT_ANOMALY_PARAMS } from "@/lib/constants";
import type { AnomalyItem, AnomalyQueryParams } from "@/lib/types";

export function useAnomalies(initialParams?: AnomalyQueryParams) {
  const [data, setData] = useState<AnomalyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(AUTO_REFRESH_INTERVAL_MS / 1000);
  const paramsRef = useRef({ ...DEFAULT_ANOMALY_PARAMS, ...initialParams });

  const fetch = useCallback(async (params?: AnomalyQueryParams) => {
    const p = { ...paramsRef.current, ...params };
    paramsRef.current = p;
    setLoading(true);
    setError(null);
    try {
      const result = await api.get<AnomalyItem[]>("/anomalies", {
        folder: p.folder!,
        max_files: p.max_files!,
        z_threshold: p.z_threshold!,
        limit: p.limit!,
      });
      setData(result);
      setLastFetched(new Date());
      setCountdown(AUTO_REFRESH_INTERVAL_MS / 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => fetch(), AUTO_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetch]);

  // Countdown ticker
  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((c) => (c <= 1 ? AUTO_REFRESH_INTERVAL_MS / 1000 : c - 1));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  return { data, loading, error, lastFetched, countdown, refresh: fetch };
}
