export type TabId = "home" | "workout" | "diet" | "book" | "me";
export type WidgetId = "card" | "capacity" | "banner" | "quote" | "plans" | "badges";

export type AppConfig = {
  v: 1;
  brand: {
    name: string;
    tagline: string;
    logoUrl: string;
    primary: string;
    accent: string;
    success: string;
    mode: "dark" | "light";
    font: "archivo" | "bebas" | "oswald" | "grotesk";
    radius: number;
    card: "glass" | "solid" | "outline";
    bg: "mesh" | "grid" | "plain";
    glow: boolean;
    motion: boolean;
    currency: string;
  };
  member: {
    welcome: string;
    showQuote: boolean;
    quotes: string[];
    banner: { on: boolean; text: string; cta: string };
    tabs: { id: TabId; label: string; enabled: boolean }[];
    widgets: { id: WidgetId; enabled: boolean }[];
  };
  plans: { id: string; name: string; price: number; days: number; perks: string }[];
  classes: { id: string; name: string; time: string; coach: string; spots: number }[];
};

export const DEFAULT_CONFIG: AppConfig = {
  v: 1,
  brand: {
    name: "Iron District",
    tagline: "Train like it's personal.",
    logoUrl: "",
    primary: "#ff4d2e",
    accent: "#ffc233",
    success: "#2ee6a6",
    mode: "dark",
    font: "bebas",
    radius: 18,
    card: "glass",
    bg: "mesh",
    glow: true,
    motion: true,
    currency: "₹",
  },
  member: {
    welcome: "Let's get it, {name}.",
    showQuote: true,
    quotes: [
      "The last rep is the one that counts.",
      "Show up today. Future you will notice.",
      "Strong is built one ordinary session at a time.",
    ],
    banner: { on: true, text: "Diwali offer: 20% off annual plans this week.", cta: "See plans" },
    tabs: [
      { id: "home", label: "Home", enabled: true },
      { id: "workout", label: "Workout", enabled: true },
      { id: "diet", label: "Diet", enabled: true },
      { id: "book", label: "Book", enabled: true },
      { id: "me", label: "Me", enabled: true },
    ],
    widgets: [
      { id: "banner", enabled: true },
      { id: "card", enabled: true },
      { id: "capacity", enabled: true },
      { id: "quote", enabled: true },
      { id: "plans", enabled: true },
      { id: "badges", enabled: true },
    ],
  },
  plans: [
    { id: "p1", name: "Monthly", price: 1500, days: 30, perks: "Floor access, locker" },
    { id: "p2", name: "Quarterly", price: 3900, days: 90, perks: "Floor access, 2 PT sessions" },
    { id: "p3", name: "Annual", price: 12000, days: 365, perks: "Everything, free shaker, 1 month freeze" },
  ],
  classes: [
    { id: "c1", name: "Morning yoga", time: "Tue 6:30 am", coach: "Sneha", spots: 4 },
    { id: "c2", name: "CrossFit WOD", time: "Tue 7:30 am", coach: "Rohit", spots: 0 },
    { id: "c3", name: "Zumba", time: "Tue 6:00 pm", coach: "Pooja", spots: 11 },
    { id: "c4", name: "HIIT 45", time: "Wed 7:00 am", coach: "Amit", spots: 2 },
  ],
};

type Json = Record<string, unknown>;
const isObj = (x: unknown): x is Json => typeof x === "object" && x !== null && !Array.isArray(x);

/** Merge stored config over defaults so new fields never break older saved gyms. */
export function mergeConfig(raw: unknown): AppConfig {
  const d = DEFAULT_CONFIG;
  if (!isObj(raw)) return d;
  const r = raw as Partial<AppConfig> & Json;
  const brand = { ...d.brand, ...(isObj(r.brand) ? (r.brand as Partial<AppConfig["brand"]>) : {}) };
  const m = isObj(r.member) ? (r.member as Partial<AppConfig["member"]>) : {};
  const tabs = d.member.tabs.map((t) => ({ ...t, ...(m.tabs?.find((x) => x.id === t.id) ?? {}) }));
  const order = (m.tabs ?? []).map((t) => t.id);
  tabs.sort((a, b) => ((order.indexOf(a.id) + 99) % 99) - ((order.indexOf(b.id) + 99) % 99));
  const widgets = d.member.widgets.map((w) => ({ ...w, ...(m.widgets?.find((x) => x.id === w.id) ?? {}) }));
  const worder = (m.widgets ?? []).map((w) => w.id);
  widgets.sort((a, b) => ((worder.indexOf(a.id) + 99) % 99) - ((worder.indexOf(b.id) + 99) % 99));
  return {
    v: 1,
    brand,
    member: {
      welcome: m.welcome ?? d.member.welcome,
      showQuote: m.showQuote ?? d.member.showQuote,
      quotes: Array.isArray(m.quotes) && m.quotes.length ? m.quotes : d.member.quotes,
      banner: { ...d.member.banner, ...(m.banner ?? {}) },
      tabs,
      widgets,
    },
    plans: Array.isArray(r.plans) ? r.plans : d.plans,
    classes: Array.isArray(r.classes) ? r.classes : d.classes,
  };
}

const HEX = /^#[0-9a-f]{6}$/i;
export function rgbTriplet(hex: string, fallback = "255 77 46") {
  if (!HEX.test(hex)) return fallback;
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}
export function readableOn(hex: string) {
  if (!HEX.test(hex)) return "255 255 255";
  const n = parseInt(hex.slice(1), 16);
  const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum > 0.6 ? "12 13 18" : "255 255 255";
}

/** The CSS variables that style the whole app. Reused by live previews. */
export function themeVars(b: AppConfig["brand"]): Record<string, string> {
  return {
    "--plate": rgbTriplet(b.primary),
    "--ember": rgbTriplet(b.accent, "255 194 51"),
    "--mat": rgbTriplet(b.success, "46 230 166"),
    "--onplate": readableOn(b.primary),
    "--r": `${b.radius}px`,
  };
}

export function applyTheme(c: AppConfig) {
  const root = document.documentElement;
  Object.entries(themeVars(c.brand)).forEach(([k, v]) => root.style.setProperty(k, v));
  root.dataset.theme = c.brand.mode;
  root.dataset.card = c.brand.card;
  root.dataset.bg = c.brand.bg;
  root.dataset.glow = c.brand.glow ? "on" : "off";
  root.dataset.motion = c.brand.motion ? "on" : "off";
  root.dataset.font = c.brand.font;
}
