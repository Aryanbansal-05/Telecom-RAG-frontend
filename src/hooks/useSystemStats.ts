"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface SystemStats {
  version: string | null;
  uptimeHuman: string | null;
  models: {
    llmName: string | null;
    llmQuantization: string | null;
    llmNCtx: number | null;
    llmLoaded: boolean;
    embeddingModel: string | null;
    embeddingLoaded: boolean;
    indexLoaded: boolean;
  };
  knowledgeBase: {
    name: string | null;
    faissVectors: number | null;
    documents: number | null;
    indexType: string | null;
  };
  loading: boolean;
  error: string | null;
}

const DEFAULT: SystemStats = {
  version: null,
  uptimeHuman: null,
  models: {
    llmName: null, llmQuantization: null, llmNCtx: null, llmLoaded: false,
    embeddingModel: null, embeddingLoaded: false, indexLoaded: false,
  },
  knowledgeBase: { name: null, faissVectors: null, documents: null, indexType: null },
  loading: true,
  error: null,
};

interface StatsResponse {
  version: string;
  uptime_human: string;
  models: {
    llm_name: string; llm_quantization: string; llm_n_ctx: number; llm_loaded: boolean;
    embedding_model: string; embedding_loaded: boolean; index_loaded: boolean;
  };
  knowledge_base: {
    name: string; faiss_vectors: number; documents: number; index_type: string;
  };
}

export function useSystemStats() {
  const [stats, setStats] = useState<SystemStats>(DEFAULT);

  const fetchStats = useCallback(async () => {
    setStats((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await api.get<StatsResponse>("/stats");
      setStats({
        version: data.version,
        uptimeHuman: data.uptime_human,
        models: {
          llmName:         data.models.llm_name,
          llmQuantization: data.models.llm_quantization,
          llmNCtx:         data.models.llm_n_ctx,
          llmLoaded:       data.models.llm_loaded,
          embeddingModel:  data.models.embedding_model,
          embeddingLoaded: data.models.embedding_loaded,
          indexLoaded:     data.models.index_loaded,
        },
        knowledgeBase: {
          name:         data.knowledge_base.name,
          faissVectors: data.knowledge_base.faiss_vectors,
          documents:    data.knowledge_base.documents,
          indexType:    data.knowledge_base.index_type,
        },
        loading: false,
        error: null,
      });
    } catch (err) {
      setStats((s) => ({
        ...s, loading: false,
        error: err instanceof Error ? err.message : "Failed to fetch stats",
      }));
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { ...stats, refresh: fetchStats };
}
