"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Award, CalendarDays, Dumbbell, Flame, Home, Salad, Sunrise, Trophy, User, Target, Droplets, HeartPulse, CalendarCheck, MessageCircle, TrendingUp, Medal, BedDouble, UsersRound, NotebookPen } from "lucide-react";
import { Badge, Button, Card, Ring, Toast, useToast } from "@/components/ui";
import { Barbell, useApp } from "@/components/app-provider";
import type { TabId } from "@/lib/config";

export const TAB_ICONS: Record<TabId, typeof Home> = {
  home: Home,
  workout: Dumbbell,
  diet: Salad,
  book: CalendarDays,
  me: User,
};

export const TAB_HREF: Record<TabId, string> = {
  home: "/portal",
  workout: "/portal/workout",
  diet: "/portal/diet",
  book: "/portal/book",
  me: "/portal/me",
};

/** Deterministic QR-looking pattern. A scannable QR is generated once members are real rows. */
export function QrPattern({ seed, className = "h-24 w-24" }: { seed: number; className?: string }) {
  const cells = useMemo(() => {
    let s = seed * 9301 + 49297;
    const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
    return Array.from({ length: 21 * 21 }, () => rnd() > 0.5);
  }, [seed]);
  const inFinder = (x: number, y: number) => (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
  const finderOn = (x: number, y: number) => {
    const ox = x > 13 ? x - 14 : x;
    const oy = y > 13 ? y - 14 : y;
    return ox === 0 || ox === 6 || oy === 0 || oy === 6 || (ox >= 2 && ox <= 4 && oy >= 2 && oy <= 4);
  };
  return (
    <svg viewBox="0 0 21 21" className={className} role="img" aria-label="Check-in code" fill="currentColor">
      {cells.map((on, i) => {
        const x = i % 21;
        const y = Math.floor(i / 21);
        const show = inFinder(x, y) ? finderOn(x, y) : on;
        return show ? <rect key={i} x={x} y={y} width={1} height={1} /> : null;
      })}
    </svg>
  );
}

export function BrandMark({ size = 28 }: { size?: number }) {
  const { config } = useApp();
  if (config.brand.logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={config.brand.logoUrl} alt="" width={size} height={size} className="rounded-md object-cover" style={{ width: size, height: size }} />;
  }
  return <Barbell size={size * 1.6} />;
}

export function firstName(fullName: string | null, email: string | null) {
  if (fullName) return fullName.split(" ")[0];
  if (email) return email.split("@")[0];
  return "Aarav";
}

export function MemberHome() {
  const { config, auth } = useApp();
  const { msg, show } = useToast();
  const [seed, setSeed] = useState(1);
  const [quote, setQuote] = useState<string | null>(null);
  const [water, setWater] = useState(3);
  const [goal, setGoal] = useState(3);
  const [workoutDone, setWorkoutDone] = useState(false);
  const [classBooked, setClassBooked] = useState(false);
  const [challengeJoined, setChallengeJoined] = useState(false);
  const [coachNote, setCoachNote] = useState("");
  const cur = config.brand.currency;

  useEffect(() => {
    const q = config.member.quotes;
    setQuote(q[new Date().getDate() % q.length] ?? null);
  }, [config.member.quotes]);
  useEffect(() => {
    const t = setInterval(() => setSeed((s) => s + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const name = firstName(auth.fullName, auth.email);
  const welcome = config.member.welcome.replaceAll("{name}", name);

  const widgets: Record<string, React.ReactNode> = {
    banner: config.member.banner.on && (
      <motion.button
        key="banner"
        whileTap={{ scale: 0.98 }}
        onClick={() => show("Plans are just below")}
        className="relative w-full overflow-hidden rounded-card bg-ember p-4 text-left text-black"
      >
        <span className="shine absolute inset-0" />
        <span className="relative block text-sm font-bold">{config.member.banner.text}</span>
        <span className="relative mt-1 inline-block text-xs font-bold underline">{config.member.banner.cta}</span>
      </motion.button>
    ),
    card: (
      <Card key="card" className="overflow-hidden">
        <div className="relative flex items-center justify-between bg-plate p-4 text-onplate">
          <span className="shine absolute inset-0 opacity-60" />
          <div className="relative flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="text-xs opacity-80">Gold member · RH-0142</p>
              <p className="text-lg font-bold">{auth.fullName ?? "Aarav Mehta"}</p>
            </div>
          </div>
          <Badge tone="ok">Active</Badge>
        </div>
        <div className="flex items-center justify-between gap-4 p-4">
          <Ring pct={62} size={124}>
            <span className="text-3xl font-bold">23</span>
            <span className="text-xs text-muted">days left</span>
          </Ring>
          <div className="text-center">
            <motion.div key={seed} initial={{ opacity: 0.2, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-ctl border border-line p-2 text-ink">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=RH-0142" alt="Demo member QR code RH-0142" width={160} height={160} className="h-24 w-24" />
            </motion.div>
            <p className="mt-1 text-[11px] text-muted">Refreshes every 30 s</p>
          </div>
        </div>
        <div className="flex gap-2 border-t border-line p-4">
          <Button className="flex-1" onClick={() => show("Opening payment…")}>
            Renew plan
          </Button>
          <Button variant="ghost" className="flex-1" onClick={() => show("Freeze request sent")}>
            Request freeze
          </Button>
        </div>
      </Card>
    ),
    capacity: (
      <Card key="capacity" className="p-4">
        <div className="mb-2 flex justify-between text-sm">
          <span className="flex items-center gap-2 font-semibold">
            <span className="pulse-dot h-2 w-2 rounded-full bg-mat" /> Gym right now
          </span>
          <span className="text-muted">35% full</span>
        </div>
        <div className="h-2.5 rounded-full bg-ink/10">
          <motion.div className="h-2.5 rounded-full bg-mat" initial={{ width: 0 }} animate={{ width: "35%" }} transition={{ duration: 1 }} />
        </div>
        <p className="mt-2 text-sm text-muted">Quiet time to train.</p>
      </Card>
    ),
    quote: config.member.showQuote && quote && (
      <p key="quote" className="rounded-card border border-plate/30 bg-plate/10 p-4 text-sm font-semibold text-plate">
        “{quote}”
      </p>
    ),
    plans: config.plans.length > 0 && (
      <div key="plans">
        <h2 className="mb-2 font-bold">Plans</h2>
        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
          {config.plans.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card min-w-0 p-4"
            >
              <p className="font-bold">{p.name}</p>
              <p className="mt-1 text-2xl font-extrabold tabular">
                {cur}
                {p.price.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted">{p.days} days</p>
              <p className="mt-2 min-h-[2.5rem] text-xs text-muted">{p.perks}</p>
              <Button className="mt-3 w-full px-3 py-1.5" onClick={() => show(`${p.name} selected`)}>
                Choose
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    ),
    badges: (
      <Card key="badges" className="p-4">
        <h2 className="mb-3 font-bold">Your badges</h2>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {(
            [
              [Flame, "10 visits", true],
              [Award, "50 visits", false],
              [Sunrise, "Early bird", true],
              [Trophy, "First PR", true],
            ] as const
          ).map(([Icon, label, got]) => (
            <div key={label} className={got ? "" : "opacity-40"}>
              <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-ember/20 text-ember">
                <Icon size={22} />
              </div>
              {label}
            </div>
          ))}
        </div>
      </Card>
    ),
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 lg:space-y-7">
      <div>
        <p className="text-sm text-muted">{config.brand.tagline}</p>
        <h1 className="display text-4xl">{welcome}</h1>
      </div>
      <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {config.member.widgets.filter((w) => w.enabled).map((w, i) => (
          <motion.div key={w.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className={w.id === "card" ? "md:col-span-2 xl:col-span-1" : ""}>{widgets[w.id]}</motion.div>
        ))}
      </div>
      <section aria-label="Member toolkit">
        <div className="mb-3"><p className="text-xs font-bold uppercase tracking-[0.2em] text-plate">Your training toolkit</p><h2 className="display mt-1 text-3xl sm:text-4xl">Small wins. Every day.</h2></div>
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Card className="min-w-0 p-4"><div className="flex items-center gap-2"><Droplets size={20}/><h3 className="font-bold">Water tracker</h3></div><p className="mt-2 text-sm text-muted">{water} of 8 glasses today</p><div className="mt-3 flex gap-2"><Button variant="ghost" disabled={water===0} onClick={()=>setWater(v=>Math.max(0,v-1))}>−</Button><Button onClick={()=>setWater(v=>Math.min(8,v+1))}>Add glass</Button></div></Card>
          <Card className="min-w-0 p-4"><div className="flex items-center gap-2"><Target size={20}/><h3 className="font-bold">Weekly workout goal</h3></div><p className="mt-2 text-sm text-muted">Target sessions per week</p><div className="mt-3 flex items-center gap-3"><button aria-label="Decrease goal" className="rounded-full border border-line px-3 py-1" onClick={()=>setGoal(v=>Math.max(1,v-1))}>−</button><strong className="text-2xl">{goal} days</strong><button aria-label="Increase goal" className="rounded-full border border-line px-3 py-1" onClick={()=>setGoal(v=>Math.min(7,v+1))}>+</button></div></Card>
          <Card className="min-w-0 p-4"><div className="flex items-center gap-2"><Dumbbell size={20}/><h3 className="font-bold">Today's workout</h3></div><p className="mt-2 text-sm text-muted">Strength session · 45 minutes</p><Button className="mt-3 w-full" variant={workoutDone?"ghost":"primary"} onClick={()=>setWorkoutDone(v=>!v)}>{workoutDone?"Marked complete ✓":"Mark complete"}</Button></Card>
          <Card className="min-w-0 p-4"><div className="flex items-center gap-2"><CalendarCheck size={20}/><h3 className="font-bold">Class booking</h3></div><p className="mt-2 text-sm text-muted">Functional training · Tomorrow, 7 AM</p><Button className="mt-3 w-full" variant={classBooked?"ghost":"primary"} onClick={()=>setClassBooked(v=>!v)}>{classBooked?"Booking confirmed ✓":"Reserve a spot"}</Button></Card>
          <Card className="min-w-0 p-4"><div className="flex items-center gap-2"><TrendingUp size={20}/><h3 className="font-bold">Progress snapshot</h3></div><div className="mt-3 grid grid-cols-3 gap-2 text-center">{[["12","Visits"],["+8%","Strength"],["4","Weeks"]].map(([n,l])=><div key={l} className="rounded-lg bg-ink/5 p-2"><strong className="block text-lg">{n}</strong><span className="text-xs text-muted">{l}</span></div>)}</div></Card>
          <Card className="min-w-0 p-4"><div className="flex items-center gap-2"><Medal size={20}/><h3 className="font-bold">Personal best</h3></div><p className="mt-2 text-sm text-muted">Squat · 100 kg</p><p className="mt-1 text-xs text-muted">Demo highlight; add your own log later.</p></Card>
          <Card className="min-w-0 p-4"><div className="flex items-center gap-2"><HeartPulse size={20}/><h3 className="font-bold">Recovery check</h3></div><p className="mt-2 text-sm text-muted">How ready do you feel today?</p><div className="mt-3 flex flex-wrap gap-2">{["Low","Okay","Great"].map(v=><button key={v} onClick={()=>show("Recovery marked: "+v)} className="rounded-full border border-line px-3 py-1.5 text-sm">{v}</button>)}</div></Card>
          <Card className="min-w-0 p-4"><div className="flex items-center gap-2"><BedDouble size={20}/><h3 className="font-bold">Sleep log</h3></div><p className="mt-2 text-sm text-muted">Track last night's rest.</p><div className="mt-3 flex flex-wrap gap-2">{["6 h","7 h","8 h+"].map(v=><button key={v} onClick={()=>show("Sleep logged: "+v)} className="rounded-full border border-line px-3 py-1.5 text-sm">{v}</button>)}</div></Card>
          <Card className="min-w-0 p-4"><div className="flex items-center gap-2"><Trophy size={20}/><h3 className="font-bold">Monthly challenge</h3></div><p className="mt-2 text-sm text-muted">Complete 12 sessions this month.</p><Button className="mt-3 w-full" variant={challengeJoined?"ghost":"primary"} onClick={()=>setChallengeJoined(v=>!v)}>{challengeJoined?"You're in ✓":"Join challenge"}</Button></Card>
          <Card className="min-w-0 p-4"><div className="flex items-center gap-2"><UsersRound size={20}/><h3 className="font-bold">Workout buddy</h3></div><p className="mt-2 text-sm text-muted">Invite a friend for a trial session.</p><Button variant="ghost" className="mt-3 w-full" onClick={()=>show("Ask the front desk for your referral link.")}>Referral info</Button></Card>
          <Card className="min-w-0 p-4"><div className="flex items-center gap-2"><NotebookPen size={20}/><h3 className="font-bold">Note for your coach</h3></div><textarea value={coachNote} onChange={e=>setCoachNote(e.target.value)} placeholder="Your goals or how you feel…" rows={2} className="mt-3 w-full resize-y rounded-lg border border-line bg-transparent p-2 text-sm"/><Button className="mt-2 w-full" onClick={()=>show(coachNote.trim()?"Coach note saved for this session.":"Write a short note first.")}>Save note</Button></Card>
          <Card className="min-w-0 p-4"><div className="flex items-center gap-2"><MessageCircle size={20}/><h3 className="font-bold">Help & support</h3></div><p className="mt-2 text-sm text-muted">Questions about plans, classes or payments?</p><a href="mailto:support@rackhouse.app?subject=Member%20support" className="mt-3 inline-flex rounded-ctl border border-line px-3 py-2 text-sm font-semibold">Contact support</a></Card>
        </div>
      </section>
      <Toast msg={msg} />
    </div>
  );
}
