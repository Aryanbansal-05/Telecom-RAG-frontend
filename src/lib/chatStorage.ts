// ── localStorage abstraction for chat history ──
// Swap this module for a Supabase/DB adapter with zero changes to consumers.

import type { ChatMessage, ChatSession } from "./types";
import { CHAT_STORAGE_KEY } from "./constants";

const SESSION_ID = "default"; // single session for now; extend for multi-session

function load(): ChatSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChatSession) : null;
  } catch {
    return null;
  }
}

function save(session: ChatSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // storage quota exceeded — silently skip
  }
}

export const chatStorage = {
  getMessages(): ChatMessage[] {
    return load()?.messages ?? [];
  },

  appendMessage(msg: ChatMessage): void {
    const session = load() ?? {
      id: SESSION_ID,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    session.messages.push(msg);
    session.updatedAt = Date.now();
    save(session);
  },

  clearHistory(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CHAT_STORAGE_KEY);
  },
};
