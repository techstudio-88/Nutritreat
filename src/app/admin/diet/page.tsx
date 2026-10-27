"use client";
import { useState } from "react";
import { Button, Card, PageHeader, Toast, useToast } from "@/components/ui";
import { Donut } from "@/components/charts";
const meals = [
  { t: "Breakfast", items: "Oats with banana, 3 egg whites, black coffee", kcal: 480 },
  { t: "Lunch", items: "Dal, 2 rotis, paneer bhurji, salad", kcal: 650 },
  { t: "Snack", items: "Greek yogurt, almonds", kcal: 240 },
  { t: "Post-workout", items: "Whey shake, banana", kcal: 260 },
  { t: "Dinner", items: "Grilled chicken, rice, sautéed vegetables", kcal: 620 },
];
export default function Diet() {
  const { msg, show } = useToast();
  const [diet, setDiet] = useState<"Veg" | "Non-veg" | "Vegan">("Non-veg");
  const [kcal, setKcal] = useState(2250);
  const protein = Math.round((kcal * 0.3) / 4), carbs = Math.round((kcal * 0.45) / 4), fat = Math.round((kcal * 0.25) / 9);
  return <>
    <PageHeader title="Diet plans" sub="Set a calorie target and the macros split for you. Edit meals, then assign." />
    <div className="grid gap-4 lg:grid-cols-3"><Card className="p-5"><h2 className="mb-3 font-bold">Targets</h2><label htmlFor="kcal" className="text-sm font-semibold">Daily calories: {kcal}</label><input id="kcal" type="range" min={1200} max={4000} step={50} value={kcal} onChange={(e) => setKcal(Number(e.target.value))} className="mt-2 w-full accent-[rgb(var(--plate))]" />
    <div className="mt-4 flex items-center gap-4"><Donut size={120} parts={[{ label: "Protein", value: protein * 4, color: "rgb(var(--plate))" }, { label: "Carbs", value: carbs * 4, color: "rgb(var(--ember))" }, { label: "Fat", value: fat * 9, color: "rgb(var(--mat))" }]} /><ul className="space-y-1 text-sm"><li>Protein {protein} g</li><li>Carbs {carbs} g</li><li>Fat {fat} g</li><li className="text-muted">Water {(kcal / 1000 + 1.5).toFixed(1)} L</li></ul></div>
    <div className="mt-4 flex gap-1">{(["Veg", "Non-veg", "Vegan"] as const).map((d) => <button key={d} onClick={() => setDiet(d)} className={`flex-1 rounded-md px-2 py-1.5 text-sm font-semibold ${diet === d ? "bg-plate text-onplate" : "border border-line text-muted"}`}>{d}</button>)}</div></Card>
    <Card className="p-5 lg:col-span-2"><div className="mb-3 flex items-center justify-between"><h2 className="font-bold">Meal plan ({diet})</h2><Button onClick={() => show("Diet assigned to Aarav Mehta")}>Assign</Button></div><ul className="space-y-2">{meals.map((m) => <li key={m.t} className="flex items-center gap-4 rounded-lg border border-line p-3"><div className="w-28 font-bold">{m.t}</div><div className="flex-1 text-sm text-muted">{m.items}</div><div className="tabular text-sm font-semibold">{m.kcal} kcal</div></li>)}</ul><p className="mt-4 text-sm text-muted">Supplements: whey after training, creatine 5 g daily, vitamin D weekly.</p></Card></div><Toast msg={msg} />
  </>;
}
