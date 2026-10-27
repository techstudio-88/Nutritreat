"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, QrCode, Dumbbell, CreditCard, ScanLine, Smartphone, Users, Megaphone } from "lucide-react";
import { Avatar, Badge, Button, Card, Ring, beep, cn } from "@/components/ui";

const scanQueue = [
  { name: "Aarav Mehta", ok: true, note: "Gold plan, 23 days left" },
  { name: "Karan Singh", ok: false, note: "Plan expired 3 days ago" },
  { name: "Priya Nair", ok: true, note: "VIP, 4 PT sessions left" },
  { name: "Vikram Joshi", ok: false, note: "Membership frozen until 30 Nov" },
  { name: "Sana Sheikh", ok: true, note: "Gold plan, 112 days left" },
];

const plans = [
  { name: "Single gym", price: "₹1,499", per: "per month", pts: ["Up to 300 members", "Check-in, billing, workouts, diet", "Member app (PWA)", "WhatsApp reminders"], hot: false },
  { name: "Growing", price: "₹3,499", per: "per month", pts: ["Unlimited members", "3 branches", "Store and inventory", "Staff payroll and shifts", "Campaign automation"], hot: true },
  { name: "Chain", price: "Talk to us", per: "", pts: ["Unlimited branches", "White-label app and domain", "API and webhooks", "Priority support"], hot: false },
];

export default function Landing() {
  const [i, setI] = useState(0);
  const cur = scanQueue[i % scanQueue.length];

  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/" className="display text-2xl">Rackhouse</Link>
        <nav className="flex items-center gap-2">
          <Link href="/portal" className="hidden px-3 py-2 text-sm font-semibold text-muted hover:text-ink sm:block">Member app</Link>
          <Link href="/login" className="px-3 py-2 text-sm font-semibold">Log in</Link>
          <Link href="/admin"><Button>Open demo</Button></Link>
        </nav>
      </header>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-10 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="display text-[clamp(3.5rem,11vw,8.5rem)]">Run the floor,<br />not the spreadsheet.</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 max-w-lg text-lg text-muted">Memberships, fees, front-desk check-in, workouts and diet plans for your gym, plus an app your members open every day.</motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-8 flex flex-wrap gap-3">
            <Link href="/admin"><Button className="px-6 py-3 text-base">Try the owner dashboard</Button></Link>
            <Link href="/portal"><Button variant="ghost" className="px-6 py-3 text-base">See the member app</Button></Link>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, rotate: 4, y: 40 }} animate={{ opacity: 1, rotate: -2, y: 0 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="mx-auto w-full max-w-sm">
          <Card className="overflow-hidden shadow-xl">
            <div className="bg-plate p-5 text-white"><p className="text-sm opacity-80">Gold member</p><p className="text-2xl font-bold">Aarav Mehta</p></div>
            <div className="flex items-center justify-between gap-4 p-5"><Ring pct={62} size={128}><span className="text-3xl font-bold">23</span><span className="text-xs text-muted">days left</span></Ring><div className="rounded-lg border border-line p-2"><QrCode size={84} /></div></div>
            <div className="border-t border-line px-5 py-3 text-sm text-muted">Gym is <b className="text-ink">35% full</b>. Quiet time to train.</div>
          </Card>
        </motion.div>
      </section>
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2">
          <div>
            <h2 className="display text-5xl sm:text-6xl">The front desk, handled.</h2>
            <p className="mt-4 max-w-md text-muted">Scan a member and see their photo, plan and status at once. Expired, frozen or overdue members are stopped with a clear reason, so your receptionist never has to argue.</p>
            <ul className="mt-6 space-y-2 text-sm">{["QR, fingerprint or manual search", "Capacity limit and over-stay alerts", "Every manual override is logged"].map((t) => <li key={t} className="flex items-center gap-2"><Check size={16} className="text-mat" /> {t}</li>)}</ul>
          </div>
          <Card className="p-6">
            <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className={cn("rounded-xl border-2 p-5", cur.ok ? "border-mat bg-mat/10" : "border-ember bg-ember/10")}>
              <div className="flex items-center gap-4"><Avatar name={cur.name} size={56} /><div><p className="text-xl font-bold">{cur.name}</p><p className="text-sm text-muted">{cur.note}</p></div><div className="ml-auto"><Badge tone={cur.ok ? "ok" : "warn"}>{cur.ok ? "Welcome in" : "Entry denied"}</Badge></div></div>
            </motion.div>
            <Button className="mt-4 w-full" onClick={() => { const next = (i + 1) % scanQueue.length; setI(next); beep(scanQueue[next].ok); }}><ScanLine size={16} /> Scan next member</Button>
          </Card>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="display max-w-3xl text-5xl sm:text-6xl">One system for owners, one app for members.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="p-6"><h3 className="text-xl font-bold">Owner and staff panel</h3><div className="mt-5 grid grid-cols-2 gap-4 text-sm">{[[Users, "Members and leads"], [CreditCard, "Billing and invoices"], [Dumbbell, "Workout and diet builder"], [Megaphone, "WhatsApp campaigns"]].map(([Icon, label]) => { const I = Icon as typeof Users; return <div key={label as string} className="flex items-center gap-2"><I size={18} className="text-plate" /> {label as string}</div>; })}</div><Link href="/admin" className="mt-6 inline-block"><Button>Open owner demo</Button></Link></Card>
          <Card className="p-6"><h3 className="text-xl font-bold">Member app</h3><div className="mt-5 grid grid-cols-2 gap-4 text-sm">{["Digital card and QR", "Today's workout with rest timer", "Diet, water and macros", "Class and trainer booking"].map((t) => <div key={t} className="flex items-center gap-2"><Smartphone size={18} className="text-plate" /> {t}</div>)}</div><Link href="/portal" className="mt-6 inline-block"><Button variant="ghost">Open member demo</Button></Link></Card>
        </div>
      </section>
      <section className="border-t border-line bg-surface"><div className="mx-auto max-w-6xl px-5 py-20"><h2 className="display text-5xl sm:text-6xl">Pricing</h2><p className="mt-3 text-muted">Pay monthly. Cancel any time.</p><div className="mt-10 grid gap-6 md:grid-cols-3">{plans.map((p) => <Card key={p.name} className={cn("flex flex-col p-6", p.hot && "border-2 border-plate")}><h3 className="text-lg font-bold">{p.name}</h3><p className="mt-3 text-4xl font-extrabold">{p.price}</p><p className="text-sm text-muted">{p.per || " "}</p><ul className="mt-5 flex-1 space-y-2 text-sm">{p.pts.map((t) => <li key={t} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-mat" /> {t}</li>)}</ul><Link href="/login" className="mt-6"><Button variant={p.hot ? "primary" : "ghost"} className="w-full">{p.price === "Talk to us" ? "Contact sales" : "Start free trial"}</Button></Link></Card>)}</div></div></section>
      <footer className="mx-auto max-w-6xl px-5 py-10 text-sm text-muted">Rackhouse. Built for gyms in India and beyond.</footer>
    </main>
  );
}
