"use client";
import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import { chatStorage } from "@/lib/chatStorage";
import type { AnswerResponse, ChatMessage } from "@/lib/types";

export function useAsk() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = useCallback(
    async (question: string, k: number = 5): Promise<AnswerResponse | null> => {
      setLoading(true);
      setError(null);

      // Persist user message
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
        timestamp: Date.now(),
        k,
      };
      chatStorage.appendMessage(userMsg);

      try {
        const result = await api.post<AnswerResponse>("/ask", { question, k });

        // Persist assistant message
        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.answer,
          sources: result.sources,
          timestamp: Date.now(),
        };
        chatStorage.appendMessage(assistantMsg);

        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { ask, loading, error };
}
