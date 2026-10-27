"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Droplet } from "lucide-react";
import { Card, cn } from "@/components/ui";
import { Donut } from "@/components/charts";
const meals = [{ t: "Breakfast", items: "Oats with banana, 3 egg whites", kcal: 480 }, { t: "Lunch", items: "Dal, 2 rotis, paneer bhurji", kcal: 650 }, { t: "Snack", items: "Greek yogurt, almonds", kcal: 240 }, { t: "Post-workout", items: "Whey shake, banana", kcal: 260 }, { t: "Dinner", items: "Grilled chicken, rice, vegetables", kcal: 620 }];
const target = 2250;
export default function Diet() {
 const [glasses, setGlasses] = useState(3); const [eaten, setEaten] = useState<string[]>(["Breakfast"]);
 const kcal = meals.filter((m) => eaten.includes(m.t)).reduce((s, m) => s + m.kcal, 0);
 return <>
  <h1 className="display mb-4 text-4xl">Today's meals</h1>
  <Card className="p-4"><div className="flex items-center gap-4"><Donut size={110} parts={[{ label: "Protein", value: 30, color: "rgb(var(--plate))" }, { label: "Carbs", value: 45, color: "rgb(var(--ember))" }, { label: "Fat", value: 25, color: "rgb(var(--mat))" }]} /><div className="flex-1 text-sm"><p className="text-2xl font-bold tabular">{Math.max(target - kcal, 0)}</p><p className="text-muted">calories left of {target}</p><div className="mt-2 h-2 rounded-full bg-ink/10"><motion.div className="h-2 rounded-full bg-plate" animate={{ width: `${Math.min(kcal / target, 1) * 100}%` }} /></div></div></div></Card>
  <Card className="mt-4 p-4"><div className="mb-3 flex justify-between"><h2 className="font-bold">Water</h2><span className="text-sm text-muted">{glasses} of 10 glasses</span></div><div className="flex flex-wrap gap-2">{Array.from({ length: 10 }).map((_, i) => <button key={i} aria-label={`Glass ${i + 1}`} onClick={() => setGlasses(i + 1 === glasses ? i : i + 1)} className="relative"><Droplet size={30} className={cn("transition", i < glasses ? "fill-plate text-plate" : "text-line")} /></button>)}</div></Card>
  <div className="mt-4 space-y-2">{meals.map((m) => { const on = eaten.includes(m.t); return <button key={m.t} onClick={() => setEaten((e) => on ? e.filter((x) => x !== m.t) : [...e, m.t])} className={cn("flex w-full items-center gap-3 rounded-xl border p-4 text-left transition", on ? "border-mat bg-mat/10" : "border-line bg-surface")}><div className="flex-1"><p className="font-bold">{m.t}</p><p className="text-sm text-muted">{m.items}</p></div><span className="tabular text-sm font-semibold">{m.kcal}</span></button>; })}</div>
 </>;
}
