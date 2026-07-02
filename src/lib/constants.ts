// ── App-wide constants ──

export const ANOMALY_FOLDERS = [
  { label: "Slice Mixed", value: "slice_mixed" },
  { label: "Slice Traffic", value: "slice_traffic" },
];

export const DEFAULT_ANOMALY_PARAMS = {
  folder: "slice_mixed",
  max_files: 30,
  z_threshold: 3.0,
  limit: 10,
};

export const DEFAULT_K = 5;

export const AUTO_REFRESH_INTERVAL_MS = 60_000; // 60 seconds

export const SUGGESTED_QUERIES = [
  "What is the purpose of the PDCP layer in 5G NR?",
  "Explain the difference between FR1 and FR2 in 5G NR.",
  "What are the key features of 5G network slicing?",
  "How does beamforming work in massive MIMO?",
  "What is O-RAN and how does it differ from traditional RAN?",
  "Explain the 3GPP handover procedure in LTE.",
  "What are the main KPIs for monitoring RAN performance?",
  "Describe the function of the RRC protocol in 5G.",
  "What is the difference between standalone (SA) and non-standalone (NSA) 5G?",
  "How does carrier aggregation improve throughput in LTE-A?",
];

export const RCA_EXAMPLE_DESCRIPTIONS = [
  "High BLER observed on PUSCH channel — uplink interference suspected",
  "Sudden drop in throughput on slice_mixed cell #12, z-score 4.2",
  "CQI degradation across multiple UEs in sector 3",
  "PRB utilization spiked to 98% causing scheduling delays",
  "Handover failure rate increased to 8% in the last hour",
];

export const CHAT_STORAGE_KEY = "telecom-rag-chat-history";
export const THEME_STORAGE_KEY = "telecom-rag-theme";
