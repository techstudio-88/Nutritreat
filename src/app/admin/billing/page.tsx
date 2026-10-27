"use client";

import { useState } from "react";
import { Link2, Receipt } from "lucide-react";
import { Badge, Button, Card, PageHeader, Stat, Table, Toast, useToast } from "@/components/ui";
import { Donut } from "@/components/charts";
import { invoices } from "@/lib/demo";

const tone = (s: string) => (s === "Paid" ? "ok" : s === "Overdue" ? "warn" : s === "Partial" ? "info" : "mute");

export default function Billing() {
  const { msg, show } = useToast();
  const [amount, setAmount] = useState("4500");
  const [method, setMethod] = useState("UPI");
  return <>
    <PageHeader title="Billing" sub="Invoices, payment links, reminders and the daily cash position." />
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4"><Stat label="Collected this month" value={642000} prefix="₹" delta="+4.2%" /><Stat label="Overdue" value={38500} prefix="₹" delta="14 members" tone="warn" /><Stat label="Expenses this month" value={231000} prefix="₹" delta="Rent, power, salaries" tone="mute" /><Stat label="Profit this month" value={411000} prefix="₹" delta="64% margin" /></div>
    <div className="mt-6 grid gap-4 lg:grid-cols-3"><Card className="p-5 lg:col-span-2"><h2 className="mb-2 font-bold">Recent invoices</h2><Table rows={invoices} cols={[{ h: "Invoice", c: (r) => <span className="font-semibold">{r.no}</span> }, { h: "Member", c: (r) => r.member }, { h: "Amount", c: (r) => `₹${r.amount.toLocaleString("en-IN")}`, className: "tabular" }, { h: "Method", c: (r) => r.method }, { h: "Status", c: (r) => <Badge tone={tone(r.status)}>{r.status}</Badge> }, { h: "Date", c: (r) => <span className="text-muted">{r.date}</span> }]} /></Card>
    <div className="space-y-4"><Card className="p-5"><h2 className="mb-3 font-bold">Collect a payment</h2><label className="text-sm font-semibold" htmlFor="amt">Amount (₹)</label><input id="amt" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full rounded-md border border-line bg-transparent px-3 py-2" /><div className="mt-3 flex gap-1">{["UPI", "Card", "Cash", "Netbanking"].map((m) => <button key={m} onClick={() => setMethod(m)} className={`flex-1 rounded-md px-2 py-1.5 text-xs font-semibold ${method === m ? "bg-plate text-white" : "border border-line text-muted"}`}>{m}</button>)}</div><div className="mt-4 flex gap-2"><Button className="flex-1" onClick={() => show(`Receipt for ₹${amount} issued`)}><Receipt size={16} /> Record</Button><Button variant="ghost" className="flex-1" onClick={() => show("Payment link copied")}><Link2 size={16} /> Link</Button></div></Card>
    <Card className="p-5"><h2 className="mb-3 font-bold">Payment methods</h2><div className="flex items-center gap-4"><Donut size={110} parts={[{ label: "UPI", value: 54, color: "rgb(var(--plate))" }, { label: "Card", value: 22, color: "rgb(var(--ember))" }, { label: "Cash", value: 18, color: "rgb(var(--mat))" }, { label: "Netbanking", value: 6, color: "rgb(var(--muted))" }]} /><ul className="space-y-1 text-sm"><li>UPI 54%</li><li>Card 22%</li><li>Cash 18%</li><li>Netbanking 6%</li></ul></div></Card></div></div><Toast msg={msg} />
  </>;
}
