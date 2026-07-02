"use client";
import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { RootCauseResponse } from "@/lib/types";

export function useRootCause() {
  const [data, setData] = useState<RootCauseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (description: string, k: number = 5) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.post<RootCauseResponse>("/rootcause", { description, k });
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

  return { data, loading, error, analyze, reset };
}
