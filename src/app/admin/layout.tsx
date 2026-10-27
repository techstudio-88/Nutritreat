"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  Loader2,
  LogOut,
  Megaphone,
  Menu,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  ScanLine,
  Salad,
  Settings,
  Store,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/components/ui";
import { useApp } from "@/components/app-provider";
import { BrandMark } from "@/components/member-ui";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/studio", label: "Design studio", icon: Palette },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/billing", label: "Billing", icon: CreditCard },
  { href: "/admin/checkin", label: "Check-in", icon: ScanLine },
  { href: "/admin/workouts", label: "Workouts", icon: Dumbbell },
  { href: "/admin/diet", label: "Diet", icon: Salad },
  { href: "/admin/staff", label: "Staff", icon: UserCog },
  { href: "/admin/store", label: "Store", icon: Store },
  { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const isActive = (path: string, href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));

function NavList({ compact, path }: { compact: boolean; path: string }) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto">
      {nav.map((n) => {
        const on = isActive(path, n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            title={compact ? n.label : undefined}
            className={cn(
              "relative flex items-center gap-3 rounded-ctl px-3 py-2.5 text-sm font-semibold transition-colors",
              compact && "justify-center",
              on ? "text-onplate" : "text-muted hover:text-ink",
            )}
          >
            {on && (
              <motion.span
                layoutId={compact ? "pill-c" : "pill"}
                className="glow-btn absolute inset-0 rounded-ctl bg-plate"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <n.icon size={19} className="relative shrink-0" />
            {!compact && <span className="relative">{n.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

function SaveChip() {
  const { status, auth } = useApp();
  if (!auth.ready) return null;
  const map = {
    demo: { t: "Demo mode", c: "text-muted", i: null },
    saving: { t: "Saving…", c: "text-ember", i: <Loader2 size={14} className="animate-spin" /> },
    saved: { t: "All changes saved", c: "text-mat", i: <Check size={14} /> },
    error: { t: "Couldn't save", c: "text-ember", i: null },
  }[status];
  return (
    <span className={cn("hidden items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs font-semibold sm:flex", map.c)}>
      {map.i}
      {map.t}
    </span>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { config, auth, signOut } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("rh-collapsed") === "1");
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("rh-collapsed", collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);
  useEffect(() => setOpen(false), [path]);

  // Members belong in the member app.
  useEffect(() => {
    if (auth.ready && auth.role === "member") router.replace("/portal");
  }, [auth.ready, auth.role, router]);

  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 244 }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="sticky top-0 hidden h-screen shrink-0 border-r border-line bg-surface/70 backdrop-blur-xl lg:block"
      >
        <div className="flex h-full flex-col p-3">
          <Link href="/" className={cn("mb-4 flex items-center gap-2 px-2 pt-2", collapsed && "justify-center px-0")}>
            <BrandMark />
            {!collapsed && <span className="display truncate text-2xl">{config.brand.name}</span>}
          </Link>
          <NavList compact={collapsed} path={path} />
          <div className="mt-3 space-y-2 border-t border-line pt-3">
            <Link
              href="/portal"
              className={cn("block rounded-ctl border border-line px-3 py-2 text-center text-sm font-semibold hover:bg-ink/5", collapsed && "px-0 text-xs")}
            >
              {collapsed ? "App" : "Open member app"}
            </Link>
            <button
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex w-full items-center justify-center gap-2 rounded-ctl px-3 py-2 text-sm font-semibold text-muted hover:text-ink"
            >
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              {!collapsed && "Collapse"}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-line bg-surface p-4 lg:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BrandMark />
                  <span className="display text-2xl">{config.brand.name}</span>
                </span>
                <button aria-label="Close menu" onClick={() => setOpen(false)} className="rounded-ctl p-2 hover:bg-ink/10">
                  <X size={20} />
                </button>
              </div>
              <NavList compact={false} path={path} />
              <Link href="/portal" className="mt-3 rounded-ctl border border-line px-3 py-2 text-center text-sm font-semibold">
                Open member app
              </Link>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-chalk/70 px-4 py-3 backdrop-blur-xl">
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="rounded-ctl border border-line p-2 lg:hidden">
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{auth.gymName ?? config.brand.name}</p>
            <p className="truncate text-xs text-muted">{auth.userId ? auth.email : "Demo data. Log in to save your gym."}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <SaveChip />
            {auth.userId ? (
              <button
                onClick={async () => {
                  await signOut();
                  router.push("/login");
                }}
                className="flex items-center gap-2 rounded-ctl border border-line px-3 py-2 text-sm font-semibold hover:bg-ink/5"
              >
                <LogOut size={16} /> <span className="hidden sm:inline">Log out</span>
              </button>
            ) : (
              <Link href="/login" className="glow-btn rounded-ctl bg-plate px-4 py-2 text-sm font-semibold text-onplate">
                Log in
              </Link>
            )}
          </div>
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
