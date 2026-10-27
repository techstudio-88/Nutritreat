"use client";
import { useState } from "react";
import { Share2 } from "lucide-react";
import { Avatar, Badge, Button, Card, Toast, Toggle, useToast } from "@/components/ui";
import { Sparkline } from "@/components/charts";
const bills = [{ no: "INV-1988", d: "14 Sep", amt: 4500 }, { no: "INV-1702", d: "14 Aug", amt: 4500 }, { no: "INV-1455", d: "14 Jul", amt: 4500 }];
export default function Me() {
 const { msg, show } = useToast(); const [lang, setLang] = useState<"English" | "हिन्दी">("English"); const [remind, setRemind] = useState(true); const [challenge, setChallenge] = useState(false);
 return <>
  <div className="mb-5 flex items-center gap-4"><Avatar name="Aarav Mehta" size={64} /><div><h1 className="text-2xl font-bold">Aarav Mehta</h1><p className="text-sm text-muted">RH-0142 · Gold</p></div></div>
  <Card className="p-4"><div className="flex items-end justify-between"><div><p className="text-sm text-muted">Weight</p><p className="text-3xl font-bold tabular">78.4 kg</p><Badge tone="ok">-2.1 kg in 6 weeks</Badge></div><Sparkline data={[80.5, 80.1, 79.6, 79.4, 78.9, 78.4]} w={130} h={48} /></div></Card>
  <Card className="mt-4 p-4"><h2 className="mb-1 font-bold">Refer a friend</h2><p className="text-sm text-muted">You both get 10% off your next renewal.</p><Button className="mt-3" onClick={() => show("Referral link copied")}><Share2 size={16} /> Share on WhatsApp</Button></Card>
  <Card className="mt-4 p-4"><h2 className="mb-3 font-bold">Billing history</h2><ul className="space-y-2 text-sm">{bills.map((b) => <li key={b.no} className="flex items-center justify-between"><span>{b.no} <span className="text-muted">· {b.d}</span></span><span className="flex items-center gap-3"><span className="tabular font-semibold">₹{b.amt.toLocaleString("en-IN")}</span><button onClick={() => show("Invoice downloaded")} className="font-semibold text-plate">PDF</button></span></li>)}</ul></Card>
  <Card className="mt-4 space-y-4 p-4 text-sm"><div className="flex items-center justify-between">Workout and billing reminders <Toggle on={remind} onChange={setRemind} label="Reminders" /></div><div className="flex items-center justify-between">Join the 30-day shred challenge <Toggle on={challenge} onChange={setChallenge} label="Challenge" /></div><div className="flex items-center justify-between">Language <div className="flex gap-1">{(["English", "हिन्दी"] as const).map((l) => <button key={l} onClick={() => setLang(l)} className={`rounded-full px-3 py-1 font-semibold ${lang === l ? "bg-plate text-onplate" : "border border-line text-muted"}`}>{l}</button>)}</div></div></Card><Toast msg={msg} />
 </>;
}
