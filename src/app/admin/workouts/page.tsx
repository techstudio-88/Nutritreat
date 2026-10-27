"use client";
import { useState } from "react";
import { Reorder } from "framer-motion";
import { GripVertical, Plus, Printer, Send } from "lucide-react";
import { Button, Card, PageHeader, Toast, useToast } from "@/components/ui";
import { exercises } from "@/lib/demo";
const templates = ["Hypertrophy 4-day", "Fat loss circuit", "Powerlifting 3-day", "Beginner strength", "Push / pull / legs"];
export default function Workouts() {
 const { msg, show } = useToast(); const [plan, setPlan] = useState<string[]>(["Barbell back squat", "Bench press", "Cable row", "Plank"]); const [q, setQ] = useState("");
 const list = exercises.filter((e) => e.name.toLowerCase().includes(q.toLowerCase()));
 return <>
  <PageHeader title="Workouts" sub="Build a plan by dragging exercises into order, then assign it to a member or a batch." action={<div className="flex gap-2"><Button variant="ghost" onClick={() => show("PDF ready to print")}><Printer size={16} /> Print</Button><Button onClick={() => show("Assigned to Morning batch")}><Send size={16} /> Assign</Button></div>} />
  <div className="grid gap-4 lg:grid-cols-3"><Card className="p-5"><h2 className="mb-3 font-bold">Exercise library</h2><input aria-label="Search exercises" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="mb-3 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm" /><ul className="space-y-2">{list.map((e) => <li key={e.name} className="flex items-center gap-2 rounded-lg border border-line p-3 text-sm"><div className="flex-1"><p className="font-semibold">{e.name}</p><p className="text-xs text-muted">{e.muscle} · {e.equip}</p></div><button aria-label={`Add ${e.name}`} onClick={() => setPlan((p) => p.includes(e.name) ? p : [...p, e.name])} className="rounded-md bg-plate p-1.5 text-white"><Plus size={14} /></button></li>)}</ul></Card>
  <Card className="p-5 lg:col-span-2"><h2 className="mb-1 font-bold">Day 1 – Lower body</h2><p className="mb-4 text-sm text-muted">Drag the handle to reorder.</p>{plan.length === 0 ? <p className="rounded-lg border border-dashed border-line p-8 text-center text-sm text-muted">Empty plan. Add exercises from the library.</p> : <Reorder.Group axis="y" values={plan} onReorder={setPlan} className="space-y-2">{plan.map((name) => <Reorder.Item key={name} value={name} className="flex cursor-grab items-center gap-3 rounded-lg border border-line bg-surface p-3 active:cursor-grabbing"><GripVertical size={18} className="text-muted" /><span className="flex-1 font-semibold">{name}</span><span className="text-sm text-muted">4 × 8 · rest 90s</span><button onClick={() => setPlan((p) => p.filter((x) => x !== name))} className="text-sm font-semibold text-ember">Remove</button></Reorder.Item>)}</Reorder.Group>}<h3 className="mb-2 mt-6 text-sm font-bold">Start from a template</h3><div className="flex flex-wrap gap-2">{templates.map((t) => <button key={t} onClick={() => show(`${t} loaded`)} className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold hover:bg-ink/5">{t}</button>)}</div></Card></div><Toast msg={msg} />
 </>;
}
