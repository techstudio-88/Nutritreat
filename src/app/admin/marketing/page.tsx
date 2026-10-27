"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import { Badge, Button, Card, PageHeader, Toast, useToast } from "@/components/ui";
const campaigns = [{ name: "Diwali offer: 20% off annual", sent: 412, read: 318, leads: 19 }, { name: "Win-back: absent 14 days", sent: 96, read: 71, leads: 11 }, { name: "Renewal reminder: 3 days left", sent: 138, read: 120, leads: 64 }];
const tags = ["{MemberName}", "{DaysLeft}", "{TrainerName}"];
export default function Marketing() {
 const { msg, show } = useToast(); const [text, setText] = useState("Hi {MemberName}, your plan ends in {DaysLeft} days. Renew today and {TrainerName} will keep your plan going.");
 const preview = text.replaceAll("{MemberName}", "Karan").replaceAll("{DaysLeft}", "3").replaceAll("{TrainerName}", "Rohit");
 return <>
  <PageHeader title="Marketing" sub="Send WhatsApp broadcasts and set rules that run on their own." />
  <div className="grid gap-4 lg:grid-cols-2"><Card className="p-5"><h2 className="mb-3 font-bold">New broadcast</h2><label htmlFor="aud" className="text-sm font-semibold">Send to</label><select id="aud" className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"><option>Expiring in 7 days (23 members)</option><option>Absent 14+ days (31 members)</option><option>All active members (412)</option></select><label htmlFor="msg" className="mt-4 block text-sm font-semibold">Message</label><textarea id="msg" rows={4} value={text} onChange={(e) => setText(e.target.value)} className="mt-1 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm" /><div className="mt-2 flex flex-wrap gap-1">{tags.map((t) => <button key={t} onClick={() => setText((x) => `${x} ${t}`)} className="rounded-full border border-line px-2 py-1 text-xs font-semibold">{t}</button>)}</div><div className="mt-4 rounded-xl bg-mat/10 p-3 text-sm"><p className="mb-1 text-xs text-muted">Preview</p>{preview}</div><Button className="mt-4" onClick={() => show("Broadcast scheduled")}><Send size={16} /> Send broadcast</Button></Card>
  <div className="space-y-4"><Card className="p-5"><h2 className="mb-3 font-bold">Automation rule</h2><p className="rounded-lg border border-line p-3 text-sm">If a member is absent <b>14 days</b>, then send WhatsApp <b>“We miss you” with 10% off</b>.</p><div className="mt-3"><Badge tone="ok">Running</Badge></div></Card><Card className="p-5"><h2 className="mb-3 font-bold">Recent campaigns</h2><ul className="space-y-3 text-sm">{campaigns.map((c) => <li key={c.name} className="flex items-center justify-between gap-3"><span className="font-semibold">{c.name}</span><span className="shrink-0 text-muted">{c.sent} sent · {Math.round((c.read / c.sent) * 100)}% read · {c.leads} leads</span></li>)}</ul></Card></div></div><Toast msg={msg} />
 </>;
}
