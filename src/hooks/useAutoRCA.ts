"use client";
import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import { DEFAULT_ANOMALY_PARAMS } from "@/lib/constants";
import type { RootCauseResponse, AutoRCAParams } from "@/lib/types";

export function useAutoRCA() {
  const [data, setData] = useState<RootCauseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAuto = useCallback(async (params?: AutoRCAParams) => {
    setLoading(true);
    setError(null);
    setData(null);
    const p = { ...DEFAULT_ANOMALY_PARAMS, ...params };
    try {
      const result = await api.get<RootCauseResponse>("/rootcause/auto", {
        folder: p.folder!,
        max_files: p.max_files!,
        z_threshold: p.z_threshold!,
      });
      setData(result);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, runAuto, reset };
}
