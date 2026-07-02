"use client";
import { getSeverity, getSeverityColor } from "@/lib/types";

interface ZScoreGaugeProps {
  zScore: number;
  size?: number;
}

export function ZScoreGauge({ zScore, size = 56 }: ZScoreGaugeProps) {
  const severity = getSeverity(Math.abs(zScore));
  const color = getSeverityColor(severity);

  // Clamp to 0-8 range for visual
  const max = 8;
  const clamped = Math.min(Math.abs(zScore), max);
  const percent = clamped / max;

  const r = (size / 2) * 0.78;
  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = 4;
  const circumference = Math.PI * r; // half circle
  const offset = circumference * (1 - percent);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size / 2 + strokeWidth} viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}>
        {/* Track */}
        <path
          d={`M ${strokeWidth / 2} ${cy} A ${r} ${r} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={`M ${strokeWidth / 2} ${cy} A ${r} ${r} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 4px ${color}80)`, transition: "stroke-dashoffset 0.6s ease" }}
        />
        {/* Value label */}
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fontSize={size * 0.2}
          fontFamily="JetBrains Mono, monospace"
          fontWeight="600"
          fill={color}
        >
          {Math.abs(zScore).toFixed(1)}σ
        </text>
      </svg>
      <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color }}>
        {severity}
      </span>
    </div>
  );
}
