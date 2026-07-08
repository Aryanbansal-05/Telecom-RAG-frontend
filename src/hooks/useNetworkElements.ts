"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface NetworkElement {
  ne_name:          string;
  ne_alias:         string;
  ne_model:         string;
  ne_type:          string;
  device_ip:        string;
  site:             string;
  vendor:           string;
  pool:             string;
  affected_service: string;
  capacity:         string | number;
  network_level:    string;
}

interface NEResponse {
  total_elements: number;
  elements: NetworkElement[];
}

interface NEFilters {
  ne_name?:  string;
  vendor?:   string;
  site?:     string;
  ne_type?:  string;
}

export function useNetworkElements(filters: NEFilters = {}) {
  const [data, setData]       = useState<NetworkElement[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async (f: NEFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (f.ne_name)  params.ne_name  = f.ne_name;
      if (f.vendor)   params.vendor   = f.vendor;
      if (f.site)     params.site     = f.site;
      if (f.ne_type)  params.ne_type  = f.ne_type;

      const res = await api.get<NEResponse>("/network-elements", params);
      setData(res.elements);
      setTotal(res.total_elements);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch network elements");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(filters); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, total, loading, error, refresh: fetch };
}
