"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ScanLine } from "lucide-react";
import { Avatar, Badge, Button, Card, PageHeader, Ring, beep, cn } from "@/components/ui";
import { checkinFeed, members } from "@/lib/demo";
export default function CheckIn() {
  const [q, setQ] = useState("");
  const [result, setResult] = useState<{ name: string; ok: boolean; why?: string } | null>(null);
  const [log, setLog] = useState(checkinFeed);
  const inside = 38;
  function check(name: string, status: string) {
    const bad = status === "Frozen" || status === "Cancelled" || status === "Blacklisted";
    const expired = status === "Expiring" && name === "Karan Singh";
    const ok = !bad && !expired;
    const why = bad ? `Membership ${status.toLowerCase()}` : expired ? "Plan expired 3 days ago" : undefined;
    setResult({ name, ok, why }); setLog((l) => [{ name, t: "Now", ok, why }, ...l].slice(0, 8)); beep(ok);
  }
  const matches = q ? members.filter((m) => m.name.toLowerCase().includes(q.toLowerCase())).slice(0, 4) : [];
  return <>
    <PageHeader title="Front desk" sub="Search a member or scan their QR. Denied entries show the reason." />
    <div className="grid gap-4 lg:grid-cols-3"><Card className="p-5 lg:col-span-2"><div className="flex gap-2"><input aria-label="Find member" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a member name" className="w-full rounded-md border border-line bg-transparent px-3 py-3 text-lg" /><Button onClick={() => check("Aarav Mehta", "Active")}><ScanLine size={18} /> Scan QR</Button></div>
    <ul className="mt-3 space-y-2">{matches.map((m) => <li key={m.id}><button onClick={() => { check(m.name, m.status); setQ(""); }} className="flex w-full items-center gap-3 rounded-lg border border-line p-3 text-left hover:bg-ink/5"><Avatar name={m.name} /><span className="flex-1 font-semibold">{m.name}</span><Badge>{m.status}</Badge></button></li>)}</ul>
    <div className="mt-6 min-h-[150px]">{result ? <motion.div key={result.name + log.length} initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={cn("flex items-center gap-5 rounded-xl border-2 p-6", result.ok ? "border-mat bg-mat/10" : "border-ember bg-ember/10")}><Avatar name={result.name} size={72} /><div><p className="text-3xl font-bold">{result.name}</p><p className="text-muted">{result.ok ? "Welcome in. Have a good session." : result.why}</p></div><div className="ml-auto"><Badge tone={result.ok ? "ok" : "warn"}>{result.ok ? "Allowed" : "Denied"}</Badge></div></motion.div> : <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">Waiting for the next member.</p>}</div></Card>
    <div className="space-y-4"><Card className="flex items-center gap-4 p-5"><Ring pct={inside} size={96} stroke={9} color="rgb(var(--mat))"><span className="text-xl font-bold">{inside}</span></Ring><div><p className="font-bold">Inside now</p><p className="text-sm text-muted">Capacity 100. Warning at 90.</p></div></Card><Card className="p-5"><h2 className="mb-3 font-bold">Recent scans</h2><ul className="space-y-2 text-sm">{log.map((c, i) => <li key={i} className="flex items-center justify-between gap-2"><span className="font-semibold">{c.name}</span><Badge tone={c.ok ? "ok" : "warn"}>{c.ok ? c.t : "Denied"}</Badge></li>)}</ul></Card></div></div>
  </>;
}
