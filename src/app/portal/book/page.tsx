"use client";

import { useState } from "react";
import { Badge, Button, Card, Toast, useToast } from "@/components/ui";
import { useApp } from "@/components/app-provider";

type State = "open" | "booked" | "waitlist";

export default function Book() {
  const { config } = useApp();
  const { msg, show } = useToast();
  const [st, setSt] = useState<Record<string, State>>({});

  return (
    <>
      <h1 className="display mb-4 text-4xl">Book a class</h1>
      {config.classes.length === 0 && (
        <p className="rounded-card border border-dashed border-line p-8 text-center text-sm text-muted">
          No classes scheduled yet. Check back soon.
        </p>
      )}
      <div className="space-y-3">
        {config.classes.map((c) => {
          const s = st[c.id] ?? "open";
          const full = c.spots === 0;
          return (
            <Card key={c.id} className="flex items-center gap-3 p-4">
              <div className="flex-1">
                <p className="font-bold">{c.name}</p>
                <p className="text-sm text-muted">
                  {c.time} · {c.coach}
                </p>
                <div className="mt-1">{full ? <Badge tone="warn">Full</Badge> : <Badge tone="ok">{c.spots} spots left</Badge>}</div>
              </div>
              {s === "open" ? (
                <Button
                  onClick={() => {
                    setSt((x) => ({ ...x, [c.id]: full ? "waitlist" : "booked" }));
                    show(full ? "You're on the waitlist" : "Spot booked");
                  }}
                >
                  {full ? "Join waitlist" : "Book"}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSt((x) => ({ ...x, [c.id]: "open" }));
                    show(s === "booked" ? "Booking cancelled" : "Left the waitlist");
                  }}
                >
                  {s === "booked" ? "Cancel" : "Leave list"}
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      <h2 className="mb-2 mt-8 font-bold">Personal training</h2>
      <Card className="p-4">
        <p className="text-sm text-muted">Pick a free slot. Your trainer confirms within the hour.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Wed 6:00 pm", "Thu 7:00 am", "Fri 6:00 pm"].map((t) => (
            <button
              key={t}
              onClick={() => show(`Requested ${t}`)}
              className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold hover:bg-ink/5"
            >
              {t}
            </button>
          ))}
        </div>
      </Card>
      <Toast msg={msg} />
    </>
  );
}
