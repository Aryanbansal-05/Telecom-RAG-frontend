import { AnomalyDashboard } from "@/components/anomalies/AnomalyDashboard";

export const metadata = {
  title: "Anomaly Detection — Telecom RAG",
  description: "Scan O-RAN telemetry CSVs and detect network anomalies using z-score statistical analysis.",
};

export default function AnomaliesPage() {
  return (
    <div className="p-6 md:p-8">
      <AnomalyDashboard />
    </div>
  );
}
