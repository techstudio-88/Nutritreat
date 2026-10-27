"use client";
import { useMemo, useState } from "react";
import { Plus, Upload } from "lucide-react";
import { Avatar, Badge, Button, Card, PageHeader, Table } from "@/components/ui";
import { members, type MemberStatus } from "@/lib/demo";
const tone = (s: MemberStatus) => s === "Active" ? "ok" : s === "Expiring" ? "warn" : s === "Frozen" ? "info" : "mute";
export default function Members() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"All" | MemberStatus>("All");
  const rows = useMemo(() => members.filter((m) => (status === "All" || m.status === status) && (m.name + m.id + m.plan + m.tags.join(" ")).toLowerCase().includes(q.toLowerCase())), [q, status]);
  return <>
    <PageHeader title="Members" sub="Search, filter and open any member profile." action={<div className="flex gap-2"><Button variant="ghost"><Upload size={16} /> Import CSV</Button><Button><Plus size={16} /> Add member</Button></div>} />
    <div className="mb-4 flex flex-wrap items-center gap-3"><input aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, ID, plan or tag" className="w-full max-w-xs rounded-md border border-line bg-surface px-3 py-2 text-sm" /><div className="no-scrollbar flex gap-1 overflow-x-auto">{(["All", "Active", "Expiring", "Frozen", "Cancelled", "Blacklisted"] as const).map((s) => <button key={s} onClick={() => setStatus(s)} className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${status === s ? "bg-plate text-onplate" : "border border-line text-muted"}`}>{s}</button>)}</div></div>
    <Card>{rows.length === 0 ? <p className="p-8 text-center text-sm text-muted">No members match. Clear the search or pick another status.</p> : <Table rows={rows} cols={[
      { h: "Member", c: (m) => <div className="flex items-center gap-3"><Avatar name={m.name} /><div><p className="font-semibold">{m.name}</p><p className="text-xs text-muted">{m.id}</p></div></div> },
      { h: "Plan", c: (m) => m.plan }, { h: "Status", c: (m) => <Badge tone={tone(m.status)}>{m.status}</Badge> }, { h: "Ends", c: (m) => m.ends }, { h: "Trainer", c: (m) => m.trainer },
      { h: "Tags", c: (m) => <div className="flex flex-wrap gap-1">{m.tags.map((t) => <span key={t} className="rounded bg-ink/10 px-1.5 py-0.5 text-xs">#{t}</span>)}</div> }, { h: "Last visit", c: (m) => <span className="text-muted">{m.last}</span> }
    ]} />}</Card>
  </>;
}
