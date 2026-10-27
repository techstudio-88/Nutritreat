"use client";
import { useState } from "react";
import { Badge, Button, Card, Toast, useToast } from "@/components/ui";
type State = "open" | "booked" | "waitlist";
const classes = [{ id: "y", name: "Morning yoga", time: "Tue 6:30 am", coach: "Sneha", left: 4 }, { id: "c", name: "CrossFit WOD", time: "Tue 7:30 am", coach: "Rohit", left: 0 }, { id: "z", name: "Zumba", time: "Tue 6:00 pm", coach: "Pooja", left: 11 }, { id: "h", name: "HIIT 45", time: "Wed 7:00 am", coach: "Amit", left: 2 }];
export default function Book() {
 const { msg, show } = useToast(); const [st, setSt] = useState<Record<string, State>>({});
 return <>
  <h1 className="display mb-4 text-4xl">Book a class</h1><div className="space-y-3">{classes.map((c) => { const s = st[c.id] ?? "open"; const full = c.left === 0; return <Card key={c.id} className="flex items-center gap-3 p-4"><div className="flex-1"><p className="font-bold">{c.name}</p><p className="text-sm text-muted">{c.time} · {c.coach}</p><div className="mt-1">{full ? <Badge tone="warn">Full</Badge> : <Badge tone="ok">{c.left} spots left</Badge>}</div></div>{s === "open" ? <Button onClick={() => { setSt((x) => ({ ...x, [c.id]: full ? "waitlist" : "booked" })); show(full ? "You're on the waitlist" : "Spot booked"); }}>{full ? "Join waitlist" : "Book"}</Button> : <Button variant="ghost" onClick={() => { setSt((x) => ({ ...x, [c.id]: "open" })); show(s === "booked" ? "Booking cancelled" : "Left the waitlist"); }}>{s === "booked" ? "Cancel" : "Leave list"}</Button>}</Card>; })}</div>
  <h2 className="mb-2 mt-8 font-bold">Personal training</h2><Card className="p-4"><p className="text-sm text-muted">Pick a trainer and a free slot. Your trainer confirms within the hour.</p><div className="mt-3 flex flex-wrap gap-2">{["Wed 6:00 pm", "Thu 7:00 am", "Fri 6:00 pm"].map((t) => <button key={t} onClick={() => show(`Requested ${t} with Rohit`)} className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold">{t}</button>)}</div></Card><Toast msg={msg} />
 </>;
}
