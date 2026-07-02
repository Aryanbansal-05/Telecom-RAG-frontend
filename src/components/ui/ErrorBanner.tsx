"use client";
import { AlertCircle, X } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-fade-in">
      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span className="flex-1 font-mono text-xs">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="hover:text-red-300 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
