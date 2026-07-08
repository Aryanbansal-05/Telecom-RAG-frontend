"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface PerformanceRecord {
  device_name:  string;
  metric_name:  string;
  metric_value: number | string;
  timestamp:    string;
}

interface PerfResponse {
  total_records: number;
  records: PerformanceRecord[];
}

interface PerfFilters {
  device_name?:  string;
  metric_name?:  string;
  limit?:        number;
}

export function usePerformance(filters: PerfFilters = {}) {
  const [data, setData]       = useState<PerformanceRecord[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async (f: PerfFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { limit: f.limit ?? 20 };
      if (f.device_name)  params.device_name  = f.device_name;
      if (f.metric_name)  params.metric_name  = f.metric_name;

      const res = await api.get<PerfResponse>("/performance", params);
      setData(res.records);
      setTotal(res.total_records);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch performance metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(filters); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, total, loading, error, refresh: fetch };
}
