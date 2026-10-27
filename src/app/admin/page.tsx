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
  const [tasks, setTasks] = useState([false, false, false, false]);
  const [ownerNote, setOwnerNote] = useState("");
  const [showQuickTools, setShowQuickTools] = useState(true);
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
    <div className="mt-6 grid gap-4 lg:grid-cols-3"><Card className="p-5 lg:col-span-2"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Attendance</h2><div className="flex gap-1 rounded-md border border-line p-0.5 text-sm">{(["7", "30", "90"] as const).map((r) => <button key={r} onClick={() => setRange(r)} className={`rounded px-3 py-1 font-semibold ${range === r ? "bg-plate text-onplate" : "text-muted"}`}>{r} days</button>)}</div></div><Bars key={range} data={series.d} labels={series.l} height={170} /></Card>
      <Card className="p-5"><h2 className="mb-3 font-bold">Live check-ins</h2><ul className="space-y-2"><AnimatePresence initial={false}>{live.map((c, i) => <motion.li key={c.name + c.t + i} layout initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 text-sm"><Avatar name={c.name} size={30} /><span className="flex-1 font-semibold">{c.name}</span><Badge tone={c.ok ? "ok" : "warn"}>{c.ok ? c.t : "Denied"}</Badge></motion.li>)}</AnimatePresence></ul></Card>
    </div>
    <section className="mt-7"><div className="mb-3 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-plate">Owner toolkit</p><h2 className="display mt-1 text-3xl sm:text-4xl">Run today's operations</h2><p className="mt-2 max-w-2xl text-sm text-muted">Quick access to the everyday jobs that keep a gym running.</p></div><Button variant="ghost" onClick={()=>setShowQuickTools(v=>!v)}>{showQuickTools ? "Hide tools" : "Show tools"}</Button></div>
      {showQuickTools && <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[
        ["Lead follow-up","Review new enquiries and trial prospects","/admin/members"],["Membership control","Manage freezes, transfers and renewals","/admin/members"],["Payment desk","Track dues, receipts and payment status","/admin/billing"],["QR front desk","Open check-in and entry decisions","/admin/checkin"],["Workout library","Maintain member training programmes","/admin/workouts"],["Nutrition plans","Review meal plans and dietary targets","/admin/diet"],["Team access","Manage staff roles and responsibilities","/admin/staff"],["Inventory & POS","Check products and stock levels","/admin/store"],["Campaign centre","Prepare offers and win-back messages","/admin/marketing"],["Brand studio","Customise the member app experience","/admin/studio"],["Gym preferences","Set capacity, currency and app defaults","/admin/settings"],["Performance reports","Review attendance and revenue trends","/admin"]
      ].map(([title,desc,href],idx)=><Link href={href} key={title} className="card block min-w-0 p-4 transition hover:-translate-y-0.5 hover:border-plate/60"><div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-plate">TOOL {String(idx+1).padStart(2,"0")}</span><span aria-hidden className="text-muted">↗</span></div><h3 className="mt-3 font-bold">{title}</h3><p className="mt-1 text-sm text-muted">{desc}</p></Link>)}</div>}</section>
    <div className="mt-6 grid gap-4 lg:grid-cols-2"><Card className="p-5"><h2 className="font-bold">Opening checklist</h2><p className="mt-1 text-sm text-muted">Keep the front desk and floor ready for members.</p><div className="mt-3 space-y-3">{["Check equipment and cleaning log","Confirm today's trainer roster","Review renewals and overdue payments","Check emergency and first-aid supplies"].map((label,i)=><label key={label} className="flex items-start gap-3 text-sm"><input type="checkbox" checked={tasks[i]} onChange={e=>setTasks(v=>v.map((x,j)=>i===j?e.target.checked:x))} className="mt-0.5 accent-[rgb(var(--plate))]"/><span className={tasks[i]?"text-muted line-through":"font-medium"}>{label}</span></label>)}</div><p className="mt-4 text-xs text-muted">{tasks.filter(Boolean).length} of {tasks.length} completed · This checklist is local to this page.</p></Card><Card className="p-5"><h2 className="font-bold">Owner notes</h2><p className="mt-1 text-sm text-muted">Keep a temporary reminder for today's shift.</p><textarea value={ownerNote} onChange={e=>setOwnerNote(e.target.value)} rows={4} placeholder="Example: Call the treadmill service team at 4 PM…" className="mt-3 w-full resize-y rounded-lg border border-line bg-transparent p-3 text-sm"/><p className="mt-2 text-xs text-muted">Notes remain in this page session and are not yet synced to the database.</p></Card></div>
    <div className="mt-6 grid gap-4 lg:grid-cols-3"><Card className="p-5 lg:col-span-2"><h2 className="mb-4 font-bold">Busy and quiet hours</h2><Heatmap grid={heat} /></Card><Card className="p-5"><h2 className="mb-3 font-bold">Members by gender</h2><div className="flex items-center gap-4"><Donut parts={[{ label: "Men", value: 58, color: "rgb(var(--plate))" }, { label: "Women", value: 39, color: "rgb(var(--ember))" }, { label: "Other", value: 3, color: "rgb(var(--mat))" }]} /><ul className="space-y-1 text-sm"><li>Men 58%</li><li>Women 39%</li><li>Other 3%</li></ul></div></Card></div>
    <div className="mt-6 grid gap-4 md:grid-cols-2"><Card className="p-5"><h2 className="mb-3 font-bold">Renewals due in 7 days</h2><ul className="space-y-2 text-sm">{members.filter((m) => m.status === "Expiring").map((m) => <li key={m.id} className="flex items-center gap-3"><Avatar name={m.name} size={30} /><span className="flex-1 font-semibold">{m.name}</span><span className="text-muted">{m.ends}</span><Button variant="ghost" className="px-3 py-1">Remind</Button></li>)}</ul></Card>
    <Card className="p-5"><h2 className="mb-3 font-bold">Not seen for 7+ days</h2><ul className="space-y-2 text-sm">{members.filter((m) => m.last.includes("week") || m.last.includes("months")).slice(0, 4).map((m) => <li key={m.id} className="flex items-center gap-3"><Avatar name={m.name} size={30} /><span className="flex-1 font-semibold">{m.name}</span><span className="text-muted">{m.last}</span><Button variant="ghost" className="px-3 py-1">WhatsApp</Button></li>)}</ul></Card></div>
  </>;
}
