"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface AlarmRecord {
  alarm_id:           string | number;
  alarm_title:        string;
  ne_name:            string;
  alarm_time:         string;
  alarm_level:        string;
  city:               string;
  vendor:             string;
  device_type:        string;
}

interface AlarmsResponse {
  total_matching: number;
  alarms: AlarmRecord[];
}

interface AlarmFilters {
  alarm_title?: string;
  ne_name?:     string;
  vendor?:      string;
  city?:        string;
  limit?:       number;
}

export function useAlarms(filters: AlarmFilters = {}) {
  const [data, setData]       = useState<AlarmRecord[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async (f: AlarmFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { limit: f.limit ?? 20 };
      if (f.alarm_title) params.alarm_title = f.alarm_title;
      if (f.ne_name)     params.ne_name     = f.ne_name;
      if (f.vendor)      params.vendor      = f.vendor;
      if (f.city)        params.city        = f.city;

      const res = await api.get<AlarmsResponse>("/alarms", params);
      setData(res.alarms);
      setTotal(res.total_matching);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch alarms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(filters); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, total, loading, error, refresh: fetch };
}
