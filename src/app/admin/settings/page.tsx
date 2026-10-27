"use client";
import { useState } from "react";
import { Badge, Button, Card, PageHeader, Toast, Toggle, useToast } from "@/components/ui";
const swatches = ["#2540ff", "#e84a10", "#0c8258", "#7c3aed", "#111827"];
export default function Settings() {
 const { msg, show } = useToast(); const [color, setColor] = useState(swatches[0]); const [twofa, setTwofa] = useState(true); const [geo, setGeo] = useState(false); const [autoOut, setAutoOut] = useState(true);
 return <>
  <PageHeader title="Settings" sub="Branding, security and the rules for your front desk." />
  <div className="grid gap-4 lg:grid-cols-2">
   <Card className="p-5"><h2 className="mb-3 font-bold">Brand colour</h2><div className="flex gap-2">{swatches.map((s) => <button key={s} aria-label={`Use ${s}`} onClick={() => setColor(s)} className="h-9 w-9 rounded-full border-2" style={{ background: s, borderColor: color === s ? "rgb(var(--ink))" : "transparent" }} />)}</div><div className="mt-4 rounded-lg p-4 text-white" style={{ background: color }}>Your members' card will look like this.</div><Button className="mt-4" onClick={() => show("Branding saved")}>Save branding</Button></Card>
   <Card className="p-5"><h2 className="mb-3 font-bold">Security and rules</h2><ul className="space-y-4 text-sm"><li className="flex items-center justify-between">Require two-step login for admins <Toggle on={twofa} onChange={setTwofa} label="Two-step login" /></li><li className="flex items-center justify-between">Only allow check-in inside the gym (GPS) <Toggle on={geo} onChange={setGeo} label="Geofence" /></li><li className="flex items-center justify-between">Check members out after 3 hours <Toggle on={autoOut} onChange={setAutoOut} label="Auto check-out" /></li></ul></Card>
   <Card className="p-5"><h2 className="mb-3 font-bold">Region</h2><div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-muted">Currency</p><p className="font-semibold">INR (₹)</p></div><div><p className="text-muted">Time zone</p><p className="font-semibold">Asia/Kolkata</p></div><div><p className="text-muted">Tax</p><p className="font-semibold">GST 18%</p></div><div><p className="text-muted">Languages</p><p className="font-semibold">English, Hindi</p></div></div></Card>
   <Card className="p-5"><h2 className="mb-3 font-bold">Integrations</h2><ul className="space-y-3 text-sm">{[["Razorpay payments", "Not connected"], ["WhatsApp Business", "Not connected"], ["Custom domain", "Not set"]].map(([n, s]) => <li key={n} className="flex items-center justify-between">{n} <Badge>{s}</Badge></li>)}</ul></Card>
  </div><Toast msg={msg} />
 </>;
}
