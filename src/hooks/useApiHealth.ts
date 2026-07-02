"use client";
import { useState, useEffect } from "react";
import type { ApiHealth } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const POLL_INTERVAL = 30_000;

export interface ApiHealthExtended extends ApiHealth {
  responseMs: number | null;
  backendMessage: string | null;
}

export function useApiHealth(): ApiHealthExtended {
  const [health, setHealth] = useState<ApiHealthExtended>({
    status: "loading",
    message: undefined,
    responseMs: null,
    backendMessage: null,
  });

  useEffect(() => {
    const check = async () => {
      const t0 = performance.now();
      try {
        const res = await fetch(`${BASE_URL}/`, { cache: "no-store" });
        const ms = Math.round(performance.now() - t0);
        if (res.ok) {
          const body = await res.json().catch(() => ({}));
          setHealth({
            status: "ok",
            message: "API Online",
            responseMs: ms,
            backendMessage: body?.message ?? null,
          });
        } else {
          setHealth({ status: "error", message: `HTTP ${res.status}`, responseMs: ms, backendMessage: null });
        }
      } catch {
        setHealth({ status: "error", message: "API Unreachable", responseMs: null, backendMessage: null });
      }
    };

    check();
    const interval = setInterval(check, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return health;
}
