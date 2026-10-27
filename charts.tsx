"use client";

import { motion } from "framer-motion";

export function Bars({ data, labels, height = 140 }: { data: number[]; labels?: string[]; height?: number }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
          <motion.div
            className="w-full rounded-t-md bg-plate"
            initial={{ height: 0 }}
            animate={{ height: `${(d / max) * 100}%` }}
            transition={{ delay: i * 0.04, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            title={`${labels?.[i] ?? i + 1}: ${d}`}
          />
          {labels && <span className="text-[11px] text-muted">{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

/** Rows = weekdays, columns = hours (6am–10pm) */
export function Heatmap({ grid }: { grid: number[][] }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="space-y-1">
      {grid.map((row, r) => (
        <div key={r} className="flex items-center gap-1">
          <span className="w-8 text-[11px] text-muted">{days[r]}</span>
          {row.map((v, c) => (
            <motion.div
              key={c}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (r * row.length + c) * 0.004 }}
              className="h-5 flex-1 rounded-sm bg-plate"
              style={{ opacity: 0.12 + v * 0.88 }}
              title={`${days[r]} ${6 + c}:00 – ${Math.round(v * 100)}% busy`}
            />
          ))}
        </div>
      ))}
      <div className="flex gap-1 pl-9 text-[11px] text-muted">
        <span className="flex-1">6am</span>
        <span className="flex-1 text-center">2pm</span>
        <span className="flex-1 text-right">10pm</span>
      </div>
    </div>
  );
}

export function Donut({
  parts,
  size = 140,
}: {
  parts: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  const r = size / 2 - 12;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={size} height={size} className="-rotate-90" role="img" aria-label="Breakdown chart">
      {parts.map((p, i) => {
        const len = (p.value / total) * c;
        const el = (
          <motion.circle
            key={p.label}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={p.color}
            strokeWidth={16}
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-acc}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.15 }}
          />
        );
        acc += len;
        return el;
      })}
    </svg>
  );
}

export function Sparkline({ data, w = 120, h = 36 }: { data: number[]; w?: number; h?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d - min) / (max - min || 1)) * (h - 4) - 2}`)
    .join(" ");
  return (
    <svg width={w} height={h} aria-hidden>
      <motion.polyline
        points={pts}
        fill="none"
        stroke="rgb(var(--plate))"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
    </svg>
  );
}
