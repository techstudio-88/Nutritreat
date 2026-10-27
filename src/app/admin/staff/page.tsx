"use client";
import { motion } from "framer-motion";
import { Avatar, Badge, Card, PageHeader } from "@/components/ui";
import { staff } from "@/lib/demo";
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const shifts: Record<string, string[]> = { "Rohit Sharma": ["6–2", "6–2", "6–2", "Off", "6–2", "7–1", "Off"], "Sneha Pillai": ["2–10", "2–10", "Off", "2–10", "2–10", "Off", "8–2"], "Amit Desai": ["Off", "6–2", "2–10", "6–2", "Off", "2–10", "2–10"], "Pooja Rane": ["6–2", "6–2", "6–2", "6–2", "6–2", "Off", "Off"], "Suresh Kale": ["10–6", "10–6", "10–6", "10–6", "10–6", "Off", "Off"] };
export default function Staff() {
 return <>
  <PageHeader title="Staff" sub="Who works when, and how full each trainer's client list is." />
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{staff.map((s) => <Card key={s.name} className="p-5"><div className="flex items-center gap-3"><Avatar name={s.name} size={44} /><div><p className="font-bold">{s.name}</p><p className="text-sm text-muted">{s.role}</p></div>{s.rating > 0 && <div className="ml-auto"><Badge tone="ok">{s.rating} ★</Badge></div>}</div>{s.limit > 0 && <div className="mt-4"><div className="mb-1 flex justify-between text-xs text-muted"><span>Clients</span><span>{s.clients} of {s.limit}</span></div><div className="h-2 rounded-full bg-ink/10"><motion.div className="h-2 rounded-full bg-plate" initial={{ width: 0 }} animate={{ width: `${(s.clients / s.limit) * 100}%` }} transition={{ duration: 0.9 }} /></div></div>}</Card>)}</div>
  <Card className="mt-6 overflow-x-clip p-5"><h2 className="mb-3 font-bold">This week's shifts</h2><table className="w-full min-w-0 table-fixed text-xs sm:text-sm"><thead><tr className="text-left text-muted"><th className="w-[27%] break-words py-2 pr-1 font-semibold">Staff</th>{days.map((d) => <th key={d} className="break-words px-0.5 py-2 text-center font-semibold">{d}</th>)}</tr></thead><tbody>{Object.entries(shifts).map(([n, row]) => <tr key={n} className="border-t border-line/60"><td className="break-words py-2 pr-1 font-semibold">{n}</td>{row.map((c, i) => <td key={i} className="break-words px-0.5 py-2 text-center"><span className={c === "Off" ? "text-muted" : "rounded bg-plate/15 px-0.5 py-1 text-plate sm:px-2"}>{c}</span></td>)}</tr>)}</tbody></table></Card>
 </>;
}
