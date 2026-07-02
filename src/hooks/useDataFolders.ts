"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { ANOMALY_FOLDERS } from "@/lib/constants";

interface FoldersResponse {
  folders: string[];
}

export function useDataFolders() {
  const [folders, setFolders] = useState<{ label: string; value: string }[]>(ANOMALY_FOLDERS);
  const [loading, setLoading] = useState(true);

  const fetchFolders = useCallback(async () => {
    try {
      const data = await api.get<FoldersResponse>("/folders");
      if (data.folders && data.folders.length > 0) {
        // Convert raw folder names to label/value pairs
        setFolders(
          data.folders.map((f) => ({
            value: f,
            label: f
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()), // "slice_mixed" → "Slice Mixed"
          }))
        );
      }
    } catch {
      // API not available — fall back to the hardcoded constants
      setFolders(ANOMALY_FOLDERS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFolders(); }, [fetchFolders]);

  return { folders, loading };
}
