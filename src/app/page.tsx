"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, CreditCard, Dumbbell, Megaphone, Palette, QrCode, ScanLine, Smartphone, Users, Zap } from "lucide-react";
import { Avatar, Badge, Button, Card, Ring, beep, cn } from "@/components/ui";
import { Barbell } from "@/components/app-provider";
import { themeVars } from "@/lib/config";

const scanQueue = [
  { name: "Aarav Mehta", ok: true, note: "Gold plan, 23 days left" },
  { name: "Karan Singh", ok: false, note: "Plan expired 3 days ago" },
  { name: "Priya Nair", ok: true, note: "VIP, 4 PT sessions left" },
  { name: "Vikram Joshi", ok: false, note: "Membership frozen until 30 Nov" },
  { name: "Sana Sheikh", ok: true, note: "Gold plan, 112 days left" },
];

const words = ["MEMBERSHIPS", "CHECK-IN", "WORKOUTS", "DIET PLANS", "FEE REMINDERS", "PT BOOKING", "POS STORE", "WHATSAPP", "PAYROLL", "LEADERBOARDS"];

const features = [
  { i: Users, t: "Members and leads", d: "Profiles, tags, freeze and transfer, a lead pipeline and trial passes." },
  { i: ScanLine, t: "Front desk", d: "QR scan, photo on screen, a buzzer for denied entry and a capacity limit." },
  { i: CreditCard, t: "Billing", d: "Invoices, partial payments, late fees, UPI links and a daily cash check." },
  { i: Dumbbell, t: "Workouts and diet", d: "Drag-and-drop plans, macro targets, rest timers and personal records." },
  { i: Megaphone, t: "Marketing", d: "WhatsApp broadcasts, win-back rules and referral rewards." },
  { i: Palette, t: "Design studio", d: "Your colours, tabs, plans and classes. Members see changes live." },
];

const swatches = ["#ff4d2e", "#3b82f6", "#a855f7", "#22d3ee", "#ec4899", "#84cc16"];

export default function Landing() {
  const [i, setI] = useState(0);
  const cur = scanQueue[i % scanQueue.length];
  const [pc, setPc] = useState("#ff4d2e");
  const [radius, setRadius] = useState(18);
  const [light, setLight] = useState(false);

  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const demoStyle = {
    ...themeVars({
      name: "",
      tagline: "",
      logoUrl: "",
      primary: pc,
      accent: "#ffc233",
      success: "#2ee6a6",
      mode: "dark",
      font: "bebas",
      radius,
      card: "glass",
      bg: "mesh",
      glow: true,
      motion: true,
      currency: "₹",
    }),
    ...(light ? ({ "--chalk": "240 241 245", "--surface": "255 255 255", "--ink": "16 18 24", "--muted": "96 104 117", "--line": "214 218 226" } as Record<string, string>) : {}),
  } as React.CSSProperties;

  return (
    <main className="overflow-x-clip">
      <header className="sticky top-0 z-40 border-b border-line/60 bg-chalk/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Barbell size={44} />
            <span className="display text-2xl">Rackhouse</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/portal" className="hidden px-3 py-2 text-sm font-semibold text-muted hover:text-ink sm:block">
              Member app
            </Link>
            <Link href="/login" className="px-3 py-2 text-sm font-semibold">
              Log in
            </Link>
            <Link href="/login">
              <Button>Start free</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section ref={hero} className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-14 lg:grid-cols-[1.3fr_1fr]">
        <motion.div style={{ y: textY }}>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-sm font-semibold"
          >
            <span className="pulse-dot h-2 w-2 rounded-full bg-mat" /> Free while we grow
          </motion.p>
          <h1 className="display text-[clamp(4rem,13vw,10rem)]">
            {["Train hard.", "Run it", "harder."].map((l, n) => (
              <motion.span
                key={l}
                className={cn("block", n === 1 && "text-plate")}
                initial={{ opacity: 0, y: 60, rotateX: -50 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.15 + n * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {l}
              </motion.span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-6 max-w-lg text-lg text-muted">
            The all-in-one app for gym owners, with a member app that looks exactly how you design it. Change a colour and every member sees it.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-8 flex flex-wrap gap-3">
            <Link href="/login">
              <Button className="px-6 py-3 text-base">Create your gym</Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" className="px-6 py-3 text-base">
                Try the owner demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: phoneY }} className="mx-auto w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, rotate: 6, y: 50 }}
            animate={{ opacity: 1, rotate: -3, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ rotate: 0, scale: 1.02 }}
          >
            <Card className="relative overflow-hidden">
              <div className="relative bg-plate p-5 text-onplate">
                <span className="shine absolute inset-0 opacity-60" />
                <p className="relative text-sm opacity-80">Gold member</p>
                <p className="relative text-2xl font-bold">Aarav Mehta</p>
              </div>
              <div className="flex items-center justify-between gap-4 p-5">
                <Ring pct={62} size={128}>
                  <span className="text-3xl font-bold">23</span>
                  <span className="text-xs text-muted">days left</span>
                </Ring>
                <div className="rounded-ctl border border-line p-2">
                  <QrCode size={84} />
                </div>
              </div>
              <div className="border-t border-line px-5 py-3 text-sm text-muted">
                Gym is <b className="text-ink">35% full</b>. Quiet time to train.
              </div>
            </Card>
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, type: "spring", stiffness: 260, damping: 14 }}
              className="absolute -right-3 -top-3 hidden rotate-6 rounded-full bg-ember px-4 py-2 text-sm font-extrabold text-black shadow-xl sm:block"
            >
              New PR · Squat 100 kg
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="border-y border-line bg-plate py-3 text-onplate">
        <div className="marquee">
          {[...words, ...words].map((w, n) => (
            <span key={n} className="display mx-6 flex items-center gap-12 text-3xl">
              {w} <Zap size={22} />
            </span>
          ))}
        </div>
      </div>

      {/* Make it yours */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2">
        <div>
          <h2 className="display text-6xl sm:text-7xl">Make it yours.</h2>
          <p className="mt-4 max-w-md text-muted">
            Pick a colour, round the corners, flip to light. In your Design studio you control every tab, plan and class, and it saves by itself.
          </p>
          <div className="mt-6 space-y-5">
            <div>
              <p className="mb-2 text-sm font-semibold">Main colour</p>
              <div className="flex gap-2">
                {swatches.map((s) => (
                  <button
                    key={s}
                    aria-label={`Use ${s}`}
                    onClick={() => setPc(s)}
                    className="h-9 w-9 rounded-full border-2 transition hover:scale-110"
                    style={{ background: s, borderColor: pc === s ? "rgb(var(--ink))" : "transparent" }}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Corners</p>
              <input
                type="range"
                min={0}
                max={32}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                aria-label="Corner roundness"
                className="w-full max-w-xs accent-[rgb(var(--plate))]"
              />
            </div>
            <button onClick={() => setLight((l) => !l)} className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
              {light ? "Switch to dark" : "Switch to light"}
            </button>
          </div>
        </div>

        <div style={demoStyle} className="mx-auto w-[300px] rounded-[2.4rem] border-[6px] border-ink/80 bg-chalk p-3 text-ink transition-colors">
          <div className="space-y-3 rounded-[1.6rem] p-2">
            <p className="display text-3xl">Let&apos;s get it, Aarav.</p>
            <div className="rounded-card bg-ember p-3 text-sm font-bold text-black">Diwali offer: 20% off annual.</div>
            <div className="card p-3">
              <div className="flex items-center gap-3">
                <Ring pct={62} size={70} stroke={8}>
                  <span className="text-lg font-bold">23</span>
                </Ring>
                <div className="text-sm">
                  <p className="font-bold">Gold plan</p>
                  <p className="text-muted">23 days left</p>
                </div>
              </div>
              <button className="glow-btn mt-3 w-full rounded-ctl bg-plate py-2 text-sm font-semibold text-onplate">Renew plan</button>
            </div>
            <div className="flex justify-around rounded-full bg-surface py-2 text-[10px] font-semibold text-muted">
              <span className="text-plate">Home</span>
              <span>Workout</span>
              <span>Diet</span>
              <span>Book</span>
            </div>
          </div>
        </div>
      </section>

      {/* Front desk */}
      <section className="border-y border-line bg-surface/40">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2">
          <div>
            <h2 className="display text-6xl sm:text-7xl">The front desk, handled.</h2>
            <p className="mt-4 max-w-md text-muted">
              Scan a member and see their photo, plan and status at once. Expired, frozen or overdue members are stopped with a clear reason, so your receptionist never has to argue.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {["QR, fingerprint or manual search", "Capacity limit and over-stay alerts", "Every manual override is logged"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check size={16} className="text-mat" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <Card className="p-6">
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn("rounded-card border-2 p-5", cur.ok ? "border-mat bg-mat/10" : "border-ember bg-ember/10")}
            >
              <div className="flex items-center gap-4">
                <Avatar name={cur.name} size={56} />
                <div>
                  <p className="text-xl font-bold">{cur.name}</p>
                  <p className="text-sm text-muted">{cur.note}</p>
                </div>
                <div className="ml-auto">
                  <Badge tone={cur.ok ? "ok" : "warn"}>{cur.ok ? "Welcome in" : "Entry denied"}</Badge>
                </div>
              </div>
            </motion.div>
            <Button
              className="mt-4 w-full"
              onClick={() => {
                const next = (i + 1) % scanQueue.length;
                setI(next);
                beep(scanQueue[next].ok);
              }}
            >
              <ScanLine size={16} /> Scan next member
            </Button>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="display max-w-3xl text-6xl sm:text-7xl">Everything on one floor plan.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, n) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (n % 3) * 0.08 }}
            >
              <Card className="h-full p-6">
                <f.i className="text-plate" size={26} />
                <h3 className="mt-4 text-lg font-bold">{f.t}</h3>
                <p className="mt-1 text-sm text-muted">{f.d}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-line bg-surface/40">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <h2 className="display text-6xl sm:text-7xl">Free right now.</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">Every feature, unlimited members, no card. Paid plans will come later, and early gyms keep what they have.</p>
          <Card className="mx-auto mt-10 max-w-sm p-8 text-left">
            <p className="font-bold">Starter</p>
            <p className="mt-2 text-5xl font-extrabold">₹0</p>
            <ul className="mt-5 space-y-2 text-sm">
              {["Owner panel and member app", "Design studio with live updates", "Check-in, billing, workouts, diet", "Your own invite code for members"].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-mat" /> {t}
                </li>
              ))}
            </ul>
            <Link href="/login" className="mt-6 block">
              <Button className="w-full">Create your gym</Button>
            </Link>
          </Card>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl items-center justify-between px-5 py-8 text-sm text-muted">
        <span className="flex items-center gap-2">
          <Smartphone size={16} /> Rackhouse. Built for gyms in India and beyond.
        </span>
        <Link href="/login" className="font-semibold text-ink">
          Log in
        </Link>
      </footer>
    </main>
  );
}
