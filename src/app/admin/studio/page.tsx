"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Copy, GripVertical, Plus, RotateCcw, Smartphone, Trash2, Undo2 } from "lucide-react";
import { Button, Card, PageHeader, Toast, Toggle, cn, useToast } from "@/components/ui";
import { useApp } from "@/components/app-provider";
import { BrandMark, MemberHome, TAB_ICONS } from "@/components/member-ui";
import type { AppConfig } from "@/lib/config";

const SECTIONS = ["Brand", "Look", "App layout", "Content", "Plans and classes"] as const;
type Section = (typeof SECTIONS)[number];

const input = "w-full rounded-ctl border border-line bg-transparent px-3 py-2 text-sm";

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <p className="mb-1 text-sm font-semibold">{label}</p>
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Seg<T extends string>({ value, options, onChange }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-semibold transition",
            value === o.v ? "glow-btn bg-plate text-onplate" : "border border-line text-muted hover:text-ink",
          )}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}

const presets = ["#ff4d2e", "#ffc233", "#2ee6a6", "#3b82f6", "#a855f7", "#ec4899", "#f97316", "#22d3ee"];

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#ff4d2e"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded-ctl border border-line bg-transparent p-0.5"
        />
        {presets.map((p) => (
          <button
            key={p}
            aria-label={`Use ${p}`}
            onClick={() => onChange(p)}
            className="h-7 w-7 rounded-full border-2 transition hover:scale-110"
            style={{ background: p, borderColor: value.toLowerCase() === p ? "rgb(var(--ink))" : "transparent" }}
          />
        ))}
      </div>
    </Field>
  );
}

function DragRow({ value, children }: { value: unknown; children: ReactNode }) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={value}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-3 rounded-ctl border border-line bg-surface/60 p-3"
      whileDrag={{ scale: 1.02, boxShadow: "0 12px 30px rgba(0,0,0,0.35)" }}
    >
      <span onPointerDown={(e) => controls.start(e)} className="cursor-grab touch-none text-muted active:cursor-grabbing" aria-label="Drag to reorder">
        <GripVertical size={18} />
      </span>
      {children}
    </Reorder.Item>
  );
}

const widgetNames: Record<string, string> = {
  banner: "Offer banner",
  card: "Membership card",
  capacity: "Gym capacity",
  quote: "Daily quote",
  plans: "Plans",
  badges: "Badges",
};

export default function Studio() {
  const { config, update, undo, canUndo, reset, canEdit, auth } = useApp();
  const { msg, show } = useToast();
  const [section, setSection] = useState<Section>("Brand");

  const setBrand = <K extends keyof AppConfig["brand"]>(k: K, v: AppConfig["brand"][K]) =>
    update((c) => ({ ...c, brand: { ...c.brand, [k]: v } }));
  const setMember = (p: Partial<AppConfig["member"]>) => update((c) => ({ ...c, member: { ...c.member, ...p } }));

  const b = config.brand;
  const m = config.member;

  return (
    <>
      <PageHeader
        title="Design studio"
        sub="Change anything here and the member app updates for every member as soon as it saves. No redeploy, no waiting."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={undo} disabled={!canUndo}>
              <Undo2 size={16} /> Undo
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                reset();
                show("Reset to the starter look");
              }}
            >
              <RotateCcw size={16} /> Reset
            </Button>
            <Link href="/portal">
              <Button>
                <Smartphone size={16} /> Open member app
              </Button>
            </Link>
          </div>
        }
      />

      {!canEdit && (
        <div className="mb-4 rounded-card border border-ember/40 bg-ember/10 p-4 text-sm">
          <b>Demo mode.</b> Your changes are saved in this browser only.{" "}
          <Link href="/login" className="font-bold underline">
            Log in as a gym owner
          </Link>{" "}
          to publish them to your members.
        </div>
      )}

      {auth.inviteCode && canEdit && (
        <Card className="mb-4 flex flex-wrap items-center gap-3 p-4">
          <div className="flex-1">
            <p className="text-sm font-semibold">Member invite code</p>
            <p className="text-xs text-muted">Members sign up and enter this code to join {auth.gymName}.</p>
          </div>
          <span className="display text-3xl tracking-widest">{auth.inviteCode}</span>
          <Button
            variant="ghost"
            onClick={() => {
              navigator.clipboard?.writeText(`${window.location.origin}/login?code=${auth.inviteCode}`);
              show("Invite link copied");
            }}
          >
            <Copy size={16} /> Copy link
          </Button>
        </Card>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div>
          <div className="no-scrollbar mb-4 flex gap-1 overflow-x-auto">
            {SECTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
                  section === s ? "glow-btn bg-plate text-onplate" : "border border-line text-muted hover:text-ink",
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <Card className="space-y-6 p-5">
            {section === "Brand" && (
              <>
                <Field label="Gym name">
                  <input className={input} value={b.name} onChange={(e) => setBrand("name", e.target.value)} />
                </Field>
                <Field label="Tagline">
                  <input className={input} value={b.tagline} onChange={(e) => setBrand("tagline", e.target.value)} />
                </Field>
                <Field label="Logo link" hint="Paste a link to a square image. Leave empty to use the barbell.">
                  <input className={input} placeholder="https://…" value={b.logoUrl} onChange={(e) => setBrand("logoUrl", e.target.value)} />
                </Field>
                <ColorField label="Main colour" value={b.primary} onChange={(v) => setBrand("primary", v)} />
                <ColorField label="Highlight colour" value={b.accent} onChange={(v) => setBrand("accent", v)} />
                <ColorField label="Success colour" value={b.success} onChange={(v) => setBrand("success", v)} />
                <Field label="Currency symbol">
                  <Seg
                    value={b.currency}
                    onChange={(v) => setBrand("currency", v)}
                    options={[
                      { v: "₹", l: "₹ Rupee" },
                      { v: "$", l: "$ Dollar" },
                      { v: "€", l: "€ Euro" },
                      { v: "£", l: "£ Pound" },
                    ]}
                  />
                </Field>
              </>
            )}

            {section === "Look" && (
              <>
                <Field label="Theme">
                  <Seg value={b.mode} onChange={(v) => setBrand("mode", v)} options={[{ v: "dark", l: "Dark" }, { v: "light", l: "Light" }]} />
                </Field>
                <Field label="Heading font">
                  <Seg
                    value={b.font}
                    onChange={(v) => setBrand("font", v)}
                    options={[
                      { v: "bebas", l: "Poster" },
                      { v: "oswald", l: "Sport" },
                      { v: "archivo", l: "Heavy" },
                      { v: "grotesk", l: "Modern" },
                    ]}
                  />
                </Field>
                <Field label="Card style">
                  <Seg
                    value={b.card}
                    onChange={(v) => setBrand("card", v)}
                    options={[{ v: "glass", l: "Glass" }, { v: "solid", l: "Solid" }, { v: "outline", l: "Outline" }]}
                  />
                </Field>
                <Field label="Background">
                  <Seg
                    value={b.bg}
                    onChange={(v) => setBrand("bg", v)}
                    options={[{ v: "mesh", l: "Moving glow" }, { v: "grid", l: "Grid" }, { v: "plain", l: "Plain" }]}
                  />
                </Field>
                <Field label={`Corner roundness: ${b.radius}px`}>
                  <input
                    type="range"
                    min={0}
                    max={32}
                    value={b.radius}
                    onChange={(e) => setBrand("radius", Number(e.target.value))}
                    className="w-full accent-[rgb(var(--plate))]"
                  />
                </Field>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Glow on hover</span>
                  <Toggle on={b.glow} onChange={(v) => setBrand("glow", v)} label="Glow" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Animations</span>
                  <Toggle on={b.motion} onChange={(v) => setBrand("motion", v)} label="Animations" />
                </div>
              </>
            )}

            {section === "App layout" && (
              <>
                <Field label="Bottom tabs" hint="Drag to reorder. Switch off what members shouldn't see.">
                  <Reorder.Group axis="y" values={m.tabs} onReorder={(tabs) => setMember({ tabs })} className="space-y-2">
                    {m.tabs.map((t) => {
                      const Icon = TAB_ICONS[t.id];
                      return (
                        <DragRow key={t.id} value={t}>
                          <Icon size={18} className="text-plate" />
                          <input
                            aria-label={`${t.id} label`}
                            className={cn(input, "flex-1")}
                            value={t.label}
                            onChange={(e) => setMember({ tabs: m.tabs.map((x) => (x.id === t.id ? { ...x, label: e.target.value } : x)) })}
                          />
                          <Toggle
                            on={t.enabled}
                            label={`Show ${t.label}`}
                            onChange={(v) => setMember({ tabs: m.tabs.map((x) => (x.id === t.id ? { ...x, enabled: v } : x)) })}
                          />
                        </DragRow>
                      );
                    })}
                  </Reorder.Group>
                </Field>
                <Field label="Home screen blocks" hint="Drag to change the order members see.">
                  <Reorder.Group axis="y" values={m.widgets} onReorder={(widgets) => setMember({ widgets })} className="space-y-2">
                    {m.widgets.map((w) => (
                      <DragRow key={w.id} value={w}>
                        <span className="flex-1 text-sm font-semibold">{widgetNames[w.id]}</span>
                        <Toggle
                          on={w.enabled}
                          label={`Show ${widgetNames[w.id]}`}
                          onChange={(v) => setMember({ widgets: m.widgets.map((x) => (x.id === w.id ? { ...x, enabled: v } : x)) })}
                        />
                      </DragRow>
                    ))}
                  </Reorder.Group>
                </Field>
              </>
            )}

            {section === "Content" && (
              <>
                <Field label="Welcome message" hint="Use {name} to insert the member's first name.">
                  <input className={input} value={m.welcome} onChange={(e) => setMember({ welcome: e.target.value })} />
                </Field>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Offer banner</span>
                  <Toggle on={m.banner.on} onChange={(on) => setMember({ banner: { ...m.banner, on } })} label="Offer banner" />
                </div>
                <Field label="Banner text">
                  <input className={input} value={m.banner.text} onChange={(e) => setMember({ banner: { ...m.banner, text: e.target.value } })} />
                </Field>
                <Field label="Banner button">
                  <input className={input} value={m.banner.cta} onChange={(e) => setMember({ banner: { ...m.banner, cta: e.target.value } })} />
                </Field>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Daily quote</span>
                  <Toggle on={m.showQuote} onChange={(showQuote) => setMember({ showQuote })} label="Daily quote" />
                </div>
                <Field label="Quotes" hint="One per line. A new one shows each day.">
                  <textarea
                    rows={4}
                    className={input}
                    value={m.quotes.join("\n")}
                    onChange={(e) => setMember({ quotes: e.target.value.split("\n").filter((l) => l.trim() !== "") })}
                  />
                </Field>
              </>
            )}

            {section === "Plans and classes" && (
              <>
                <Field label="Membership plans">
                  <div className="space-y-2">
                    {config.plans.map((p) => (
                      <div key={p.id} className="grid grid-cols-[1fr_90px_70px_auto] items-center gap-2 rounded-ctl border border-line p-2">
                        <input
                          aria-label="Plan name"
                          className={input}
                          value={p.name}
                          onChange={(e) => update((c) => ({ ...c, plans: c.plans.map((x) => (x.id === p.id ? { ...x, name: e.target.value } : x)) }))}
                        />
                        <input
                          aria-label="Price"
                          inputMode="numeric"
                          className={input}
                          value={p.price}
                          onChange={(e) => update((c) => ({ ...c, plans: c.plans.map((x) => (x.id === p.id ? { ...x, price: Number(e.target.value.replace(/\D/g, "")) } : x)) }))}
                        />
                        <input
                          aria-label="Days"
                          inputMode="numeric"
                          className={input}
                          value={p.days}
                          onChange={(e) => update((c) => ({ ...c, plans: c.plans.map((x) => (x.id === p.id ? { ...x, days: Number(e.target.value.replace(/\D/g, "")) } : x)) }))}
                        />
                        <button
                          aria-label={`Delete ${p.name}`}
                          onClick={() => update((c) => ({ ...c, plans: c.plans.filter((x) => x.id !== p.id) }))}
                          className="rounded-ctl p-2 text-ember hover:bg-ember/10"
                        >
                          <Trash2 size={16} />
                        </button>
                        <input
                          aria-label="Perks"
                          placeholder="What's included"
                          className={cn(input, "col-span-4")}
                          value={p.perks}
                          onChange={(e) => update((c) => ({ ...c, plans: c.plans.map((x) => (x.id === p.id ? { ...x, perks: e.target.value } : x)) }))}
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    className="mt-2"
                    onClick={() => update((c) => ({ ...c, plans: [...c.plans, { id: `p${Date.now()}`, name: "New plan", price: 1000, days: 30, perks: "" }] }))}
                  >
                    <Plus size={16} /> Add plan
                  </Button>
                </Field>

                <Field label="Class schedule">
                  <div className="space-y-2">
                    {config.classes.map((k) => (
                      <div key={k.id} className="grid grid-cols-2 items-center gap-2 rounded-ctl border border-line p-2 sm:grid-cols-[1fr_1fr_90px_60px_auto]">
                        <input
                          aria-label="Class name"
                          className={input}
                          value={k.name}
                          onChange={(e) => update((c) => ({ ...c, classes: c.classes.map((x) => (x.id === k.id ? { ...x, name: e.target.value } : x)) }))}
                        />
                        <input
                          aria-label="Time"
                          className={input}
                          value={k.time}
                          onChange={(e) => update((c) => ({ ...c, classes: c.classes.map((x) => (x.id === k.id ? { ...x, time: e.target.value } : x)) }))}
                        />
                        <input
                          aria-label="Coach"
                          className={input}
                          value={k.coach}
                          onChange={(e) => update((c) => ({ ...c, classes: c.classes.map((x) => (x.id === k.id ? { ...x, coach: e.target.value } : x)) }))}
                        />
                        <input
                          aria-label="Spots"
                          inputMode="numeric"
                          className={input}
                          value={k.spots}
                          onChange={(e) => update((c) => ({ ...c, classes: c.classes.map((x) => (x.id === k.id ? { ...x, spots: Number(e.target.value.replace(/\D/g, "")) } : x)) }))}
                        />
                        <button
                          aria-label={`Delete ${k.name}`}
                          onClick={() => update((c) => ({ ...c, classes: c.classes.filter((x) => x.id !== k.id) }))}
                          className="rounded-ctl p-2 text-ember hover:bg-ember/10"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    className="mt-2"
                    onClick={() => update((c) => ({ ...c, classes: [...c.classes, { id: `c${Date.now()}`, name: "New class", time: "Mon 6:00 am", coach: "Coach", spots: 10 }] }))}
                  >
                    <Plus size={16} /> Add class
                  </Button>
                </Field>
              </>
            )}
          </Card>
        </div>

        {/* Live phone preview */}
        <div className="xl:sticky xl:top-20 xl:self-start">
          <p className="mb-2 text-center text-sm font-semibold text-muted">Live preview</p>
          <div className="mx-auto w-[320px] rounded-[2.6rem] border-[6px] border-ink/80 bg-chalk p-2 shadow-2xl">
            <div className="mx-auto mb-2 h-5 w-24 rounded-full bg-ink/80" />
            <div className="no-scrollbar h-[560px] overflow-y-auto rounded-[1.8rem] px-3 pb-6 pt-3">
              <div className="mb-3 flex items-center gap-2">
                <BrandMark />
                <span className="display text-lg">{b.name}</span>
              </div>
              <MemberHome />
            </div>
            <div className="mt-2 flex justify-around rounded-full bg-surface/90 py-2">
              {m.tabs
                .filter((t) => t.enabled)
                .map((t, i) => {
                  const Icon = TAB_ICONS[t.id];
                  return (
                    <span key={t.id} className={cn("flex flex-col items-center text-[9px] font-semibold", i === 0 ? "text-plate" : "text-muted")}>
                      <Icon size={16} />
                      {t.label}
                    </span>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <Toast msg={msg} />
    </>
  );
}
