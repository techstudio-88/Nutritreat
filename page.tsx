"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Timer } from "lucide-react";
import { Button, Card, beep, cn } from "@/components/ui";

type Ex = { name: string; sets: number; reps: number; kg: number };
const plan: Ex[] = [
  { name: "Barbell back squat", sets: 4, reps: 8, kg: 80 },
  { name: "Romanian deadlift", sets: 3, reps: 10, kg: 70 },
  { name: "Bench press", sets: 4, reps: 8, kg: 60 },
  { name: "Plank", sets: 3, reps: 1, kg: 0 },
];

export default function Workout() {
  const [done, setDone] = useState<Record<string, number>>({});
  const [rest, setRest] = useState(0);
  const [pr, setPr] = useState(false);

  useEffect(() => {
    if (rest <= 0) return;
    const t = setTimeout(() => {
      setRest((r) => r - 1);
      if (rest === 1) beep(true);
    }, 1000);
    return () => clearTimeout(t);
  }, [rest]);

  function logSet(e: Ex) {
    const n = (done[e.name] ?? 0) + 1;
    if (n > e.sets) return;
    setDone((d) => ({ ...d, [e.name]: n }));
    setRest(90);
    if (e.name === "Barbell back squat" && n === 3) {
      setPr(true);
      setTimeout(() => setPr(false), 2600);
    }
  }

  const total = plan.reduce((s, e) => s + e.sets, 0);
  const completed = Object.values(done).reduce((s, n) => s + n, 0);

  return (
    <>
      <h1 className="display text-4xl">Lower body</h1>
      <p className="mb-4 text-sm text-muted">
        {completed} of {total} sets done
      </p>
      <div className="mb-4 h-2 rounded-full bg-ink/10">
        <motion.div className="h-2 rounded-full bg-plate" animate={{ width: `${(completed / total) * 100}%` }} />
      </div>

      <div className="space-y-3">
        {plan.map((e) => {
          const n = done[e.name] ?? 0;
          return (
            <Card key={e.name} className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-bold">{e.name}</p>
                <span className="text-sm text-muted">
                  {e.sets} × {e.reps}
                  {e.kg ? ` · ${e.kg} kg` : ""}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {Array.from({ length: e.sets }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold",
                      i < n ? "border-mat bg-mat text-white" : "border-line text-muted",
                    )}
                  >
                    {i < n ? <Check size={14} /> : i + 1}
                  </span>
                ))}
                <Button className="ml-auto px-3 py-1.5" disabled={n >= e.sets} onClick={() => logSet(e)}>
                  Log set
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <AnimatePresence>
        {rest > 0 && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="fixed inset-x-0 bottom-20 z-40 mx-auto flex w-[calc(100%-2rem)] max-w-sm items-center gap-3 rounded-full bg-ink px-5 py-3 text-chalk shadow-xl"
          >
            <Timer size={18} />
            <span className="flex-1 font-semibold">Rest</span>
            <span className="text-2xl font-bold tabular">
              {Math.floor(rest / 60)}:{String(rest % 60).padStart(2, "0")}
            </span>
            <button onClick={() => setRest(0)} className="text-sm font-semibold opacity-80">
              Skip
            </button>
          </motion.div>
        )}
        {pr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 px-6"
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-2 w-2 rounded-sm"
                style={{ background: ["#2540ff", "#e84a10", "#0c8258", "#fbbf24"][i % 4] }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((i / 24) * Math.PI * 2) * (120 + (i % 3) * 40),
                  y: Math.sin((i / 24) * Math.PI * 2) * (120 + (i % 3) * 40),
                  opacity: 0,
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            ))}
            <motion.div
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
              className="rounded-2xl bg-surface p-8 text-center"
            >
              <p className="display text-5xl text-ember">New PR</p>
              <p className="mt-2 font-semibold">Back squat, 80 kg × 8</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
