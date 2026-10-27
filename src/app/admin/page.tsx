"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserPlus, Wallet, Salad, Ticket, Download } from "lucide-react";
import { Badge, Button, Card, PageHeader, Stat, Avatar } from "@/components/ui";
import { Bars, Donut, Heatmap } from "@/components/charts";
import { checkinFeed, heat, members } from "@/lib/demo";

export default function Dashboard() {
  const [range, setRange] = useState<"7" | "30" | "90">("7");
  const [live, setLive] = useState(checkinFeed.slice(0, 4));
  const [inside, setInside] = useState(38);
  useEffect(() => {
    let n = 4;
    const t = setInterval(() => { const next = checkinFeed[n % checkinFeed.length]; n++; setLive((l) => [next, ...l].slice(0, 5)); if (next.ok) setInside((v) => v + 1); }, 4000);
    return () => clearInterval(t);
  }, []);
  const series = {
    "7": { d: [212, 198, 224, 205, 231, 168, 140], l: ["M", "T", "W", "T", "F", "S", "S"] },
    "30": { d: [1380, 1420, 1310, 1495], l: ["W1", "W2", "W3", "W4"] },
    "90": { d: [4120, 4380, 4510], l: ["Aug", "Sep", "Oct"] },
  }[range];
  return <>
    <PageHeader title="Today at the gym" sub="Live numbers for Pune – Koregaon Park." action={<Button variant="ghost"><Download size={16} /> Daily report</Button>} />
    <div className="mb-6 flex flex-wrap gap-2">{[[UserPlus, "Add member", "/admin/members"], [Wallet, "Collect payment", "/admin/billing"], [Salad, "Assign diet", "/admin/diet"], [Ticket, "Issue pass", "/admin/checkin"]].map(([Icon, label, href]) => { const I = Icon as typeof UserPlus; return <Link key={label as string} href={href as string}><Button variant="ghost"><I size={16} /> {label as string}</Button></Link>; })}</div>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Stat label="Check-ins today" value={212} delta="+8% vs last Monday" /><Stat label="Inside right now" value={inside} delta="Capacity 100" tone="info" /><Stat label="Collected today" value={48500} prefix="₹" delta="6 payments" /><Stat label="Monthly recurring revenue" value={642000} prefix="₹" delta="+4.2%" /><Stat label="Overdue payments" value={14} delta="₹38,500 pending" tone="warn" /><Stat label="New members this month" value={46} delta="+12 vs Sep" /><Stat label="Churn rate" value={3.1} suffix="%" decimals={1} delta="-0.4 pts" /><Stat label="Low-stock items" value={2} delta="Restock soon" tone="warn" />
    </div>
    <div className="mt-6 grid gap-4 lg:grid-cols-3"><Card className="p-5 lg:col-span-2"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Attendance</h2><div className="flex gap-1 rounded-md border border-line p-0.5 text-sm">{(["7", "30", "90"] as const).map((r) => <button key={r} onClick={() => setRange(r)} className={`rounded px-3 py-1 font-semibold ${range === r ? "bg-plate text-white" : "text-muted"}`}>{r} days</button>)}</div></div><Bars key={range} data={series.d} labels={series.l} height={170} /></Card>
      <Card className="p-5"><h2 className="mb-3 font-bold">Live check-ins</h2><ul className="space-y-2"><AnimatePresence initial={false}>{live.map((c, i) => <motion.li key={c.name + c.t + i} layout initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 text-sm"><Avatar name={c.name} size={30} /><span className="flex-1 font-semibold">{c.name}</span><Badge tone={c.ok ? "ok" : "warn"}>{c.ok ? c.t : "Denied"}</Badge></motion.li>)}</AnimatePresence></ul></Card>
    </div>
    <div className="mt-6 grid gap-4 lg:grid-cols-3"><Card className="p-5 lg:col-span-2"><h2 className="mb-4 font-bold">Busy and quiet hours</h2><Heatmap grid={heat} /></Card><Card className="p-5"><h2 className="mb-3 font-bold">Members by gender</h2><div className="flex items-center gap-4"><Donut parts={[{ label: "Men", value: 58, color: "rgb(var(--plate))" }, { label: "Women", value: 39, color: "rgb(var(--ember))" }, { label: "Other", value: 3, color: "rgb(var(--mat))" }]} /><ul className="space-y-1 text-sm"><li>Men 58%</li><li>Women 39%</li><li>Other 3%</li></ul></div></Card></div>
    <div className="mt-6 grid gap-4 md:grid-cols-2"><Card className="p-5"><h2 className="mb-3 font-bold">Renewals due in 7 days</h2><ul className="space-y-2 text-sm">{members.filter((m) => m.status === "Expiring").map((m) => <li key={m.id} className="flex items-center gap-3"><Avatar name={m.name} size={30} /><span className="flex-1 font-semibold">{m.name}</span><span className="text-muted">{m.ends}</span><Button variant="ghost" className="px-3 py-1">Remind</Button></li>)}</ul></Card>
    <Card className="p-5"><h2 className="mb-3 font-bold">Not seen for 7+ days</h2><ul className="space-y-2 text-sm">{members.filter((m) => m.last.includes("week") || m.last.includes("months")).slice(0, 4).map((m) => <li key={m.id} className="flex items-center gap-3"><Avatar name={m.name} size={30} /><span className="flex-1 font-semibold">{m.name}</span><span className="text-muted">{m.last}</span><Button variant="ghost" className="px-3 py-1">WhatsApp</Button></li>)}</ul></Card></div>
  </>;
}
