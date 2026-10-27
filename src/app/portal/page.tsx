"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Award, Flame, Sunrise, Trophy } from "lucide-react";
import { Badge, Button, Card, Ring, Toast, useToast } from "@/components/ui";
const quotes = ["The last rep is the one that counts.", "Show up today. Future you will notice.", "Strong is built one ordinary session at a time."];
function QrPattern({ seed }: { seed: number }) {
 const cells = useMemo(() => { let s = seed; const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296); return Array.from({ length: 21 * 21 }, () => rnd() > 0.5); }, [seed]);
 const finder = (x: number, y: number) => (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
 return <svg viewBox="0 0 21 21" className="h-28 w-28" role="img" aria-label="Check-in code">{cells.map((on, i) => { const x = i % 21, y = Math.floor(i / 21), f = finder(x, y); const edge = f && (x % 14 === 0 || x % 14 === 6 || y % 14 === 0 || y % 14 === 6 || ((x % 14) > 1 && (x % 14) < 5 && (y % 14) > 1 && (y % 14) < 5)); return (f ? edge : on) ? <rect key={i} x={x} y={y} width={1} height={1} fill="currentColor" /> : null; })}</svg>;
}
export default function PortalHome() {
 const { msg, show } = useToast(); const [seed, setSeed] = useState(1); const [quote, setQuote] = useState<string | null>(null);
 useEffect(() => { setQuote(quotes[new Date().getDate() % quotes.length]); const t = setInterval(() => setSeed((s) => s + 1), 30000); return () => clearInterval(t); }, []);
 return <>
  <p className="text-sm text-muted">Good morning</p><h1 className="display mb-4 text-4xl">Aarav</h1>{quote && <p className="mb-4 rounded-lg bg-plate/10 p-3 text-sm font-semibold text-plate">{quote}</p>}
  <Card className="overflow-hidden"><div className="flex items-center justify-between bg-plate p-4 text-white"><div><p className="text-xs opacity-80">Gold member · RH-0142</p><p className="text-lg font-bold">Aarav Mehta</p></div><Badge tone="ok">Active</Badge></div><div className="flex items-center justify-between gap-4 p-4"><Ring pct={62} size={124}><span className="text-3xl font-bold">23</span><span className="text-xs text-muted">days left</span></Ring><div className="text-center"><motion.div key={seed} initial={{ opacity: 0.2 }} animate={{ opacity: 1 }} className="rounded-lg border border-line p-2"><QrPattern seed={seed} /></motion.div><p className="mt-1 text-[11px] text-muted">Refreshes every 30 s</p></div></div><div className="flex gap-2 border-t border-line p-4"><Button className="flex-1" onClick={() => show("Opening payment…")}>Renew plan</Button><Button variant="ghost" className="flex-1" onClick={() => show("Freeze request sent")}>Request freeze</Button></div></Card>
  <Card className="mt-4 p-4"><div className="mb-2 flex justify-between text-sm"><span className="font-semibold">Gym right now</span><span className="text-muted">35% full</span></div><div className="h-2.5 rounded-full bg-ink/10"><motion.div className="h-2.5 rounded-full bg-mat" initial={{ width: 0 }} animate={{ width: "35%" }} transition={{ duration: 1 }} /></div><p className="mt-2 text-sm text-muted">Quiet time to train.</p></Card>
  <Card className="mt-4 p-4"><h2 className="mb-3 font-bold">Your badges</h2><div className="grid grid-cols-4 gap-2 text-center text-xs">{[[Flame, "10 visits", true], [Award, "50 visits", false], [Sunrise, "Early bird", true], [Trophy, "First PR", true]].map(([Icon, label, got]) => { const I = Icon as typeof Flame; return <div key={label as string} className={got ? "" : "opacity-40"}><div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-ember/15 text-ember"><I size={22} /></div>{label as string}</div>; })}</div></Card><Toast msg={msg} />
 </>;
}
