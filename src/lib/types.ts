// ── TypeScript interfaces matching FastAPI response models ──

export interface QuestionRequest {
  question: string;
  k?: number;
}

export interface AnswerResponse {
  answer: string;
  sources: string[];
}

export interface RootCauseRequest {
  description: string;
  k?: number;
}

export interface RootCauseResponse {
  explanation: string;
  sources: string[];
}

export interface AnomalyItem {
  metric: string;
  value: number;
  z_score: number;
  source_file: string;
  time: number | null;
  description: string;
}

export interface AnomalyQueryParams {
  folder?: string;
  max_files?: number;
  z_threshold?: number;
  limit?: number;
}

export interface AutoRCAParams {
  folder?: string;
  max_files?: number;
  z_threshold?: number;
}

// ── Chat history types ──
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: number;
  k?: number;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

// ── API status ──
export interface ApiHealth {
  status: "ok" | "error" | "loading";
  message?: string;
}

// ── Severity helpers ──
export type SeverityLevel = "critical" | "high" | "medium" | "low";

export function getSeverity(z_score: number): SeverityLevel {
  if (z_score >= 5) return "critical";
  if (z_score >= 4) return "high";
  if (z_score >= 3) return "medium";
  return "low";
}

export function getSeverityColor(level: SeverityLevel): string {
  switch (level) {
    case "critical": return "#EF4444";
    case "high":     return "#F59E0B";
    case "medium":   return "#06B6D4";
    default:         return "#10B981";
  }
}
