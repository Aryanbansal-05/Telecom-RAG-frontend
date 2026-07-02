"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { RCAPanel } from "@/components/rootcause/RCAPanel";

function RCAContent() {
  const searchParams = useSearchParams();
  const desc = searchParams.get("desc") ?? undefined;
  return <RCAPanel initialDescription={desc} />;
}

export default function RootCausePage() {
  return (
    <div className="p-6 md:p-8 h-[calc(100vh-3.5rem)] flex flex-col">
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-[var(--text-muted)] font-mono text-sm">Loading…</div>}>
        <RCAContent />
      </Suspense>
    </div>
  );
}
