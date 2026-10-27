"use client";

import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const cn = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

export function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 1.1, ease: "easeOut", onUpdate: (v) => setN(v) });
    return () => c.stop();
  }, [inView, value]);
  return (
    <span ref={ref} className="tabular">
      {prefix}
      {n.toLocaleString("en-IN", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-line bg-surface", className)}>{children}</div>;
}

type Tone = "ok" | "warn" | "info" | "mute";
const tones: Record<Tone, string> = {
  ok: "bg-mat/15 text-mat",
  warn: "bg-ember/15 text-ember",
  info: "bg-plate/15 text-plate",
  mute: "bg-ink/10 text-muted",
};

export function Badge({ tone = "mute", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  className,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "ember";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const v = {
    primary: "bg-plate text-white hover:brightness-110",
    ember: "bg-ember text-white hover:brightness-110",
    ghost: "border border-line bg-surface text-ink hover:bg-ink/5",
  }[variant];
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:opacity-50",
        v,
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="display text-4xl sm:text-5xl">{title}</h1>
        {sub && <p className="mt-2 max-w-xl text-sm text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stat({
  label,
  value,
  prefix,
  suffix,
  decimals,
  delta,
  tone = "ok",
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: string;
  tone?: Tone;
}) {
  return (
    <Card className="p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-3xl font-bold">
        <Counter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </p>
      {delta && (
        <div className="mt-2">
          <Badge tone={tone}>{delta}</Badge>
        </div>
      )}
    </Card>
  );
}

export function Ring({
  pct,
  size = 120,
  stroke = 10,
  children,
  color = "rgb(var(--plate))",
}: {
  pct: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--line))" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - Math.min(Math.max(pct, 0), 100) / 100) }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}

export function Table<T>({
  cols,
  rows,
}: {
  cols: { h: string; c: (r: T) => ReactNode; className?: string }[];
  rows: T[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-muted">
            {cols.map((c) => (
              <th key={c.h} className={cn("px-4 py-3 font-semibold", c.className)}>
                {c.h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <motion.tr
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              className="border-b border-line/60 last:border-0 hover:bg-ink/[0.03]"
            >
              {cols.map((c) => (
                <td key={c.h} className={cn("px-4 py-3", c.className)}>
                  {c.c(r)}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-plate/15 font-bold text-plate"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn("relative h-6 w-11 rounded-full transition", on ? "bg-plate" : "bg-ink/20")}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white", on ? "right-0.5" : "left-0.5")}
      />
    </button>
  );
}

export function Toast({ msg }: { msg: string | null }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center lg:bottom-6">
      {msg && (
        <motion.div
          key={msg}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-chalk shadow-lg"
        >
          {msg}
        </motion.div>
      )}
    </div>
  );
}

export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = (m: string) => {
    setMsg(m);
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => setMsg(null), 2200);
  };
  return { msg, show };
}

export function beep(ok: boolean) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = ok ? "sine" : "sawtooth";
    o.frequency.value = ok ? 880 : 160;
    g.gain.value = 0.08;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + (ok ? 0.15 : 0.4));
  } catch {
    /* audio not available */
  }
}
