"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, CreditCard, ScanLine, Dumbbell, Salad, UserCog, Store, Megaphone, Settings, Moon, Sun, Search } from "lucide-react";
import { cn } from "@/components/ui";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [dark, setDark] = useState(false);
  useEffect(() => { try { if (localStorage.getItem("rh-theme") === "dark") setDark(true); } catch {} }, []);
  useEffect(() => { document.documentElement.setAttribute("data-theme", dark ? "dark" : "light"); try { localStorage.setItem("rh-theme", dark ? "dark" : "light"); } catch {} }, [dark]);
  const active = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));

  return <div className="min-h-screen lg:grid lg:grid-cols-[232px_1fr]">
    <aside className="hidden border-r border-line bg-surface lg:block"><div className="sticky top-0 flex h-screen flex-col p-4">
      <Link href="/" className="display px-2 pb-6 pt-2 text-2xl">Rackhouse</Link>
      <nav className="flex-1 space-y-1">{nav.map((n) => <Link key={n.href} href={n.href} className={cn("relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold", active(n.href) ? "text-white" : "text-muted hover:text-ink")}>
        {active(n.href) && <motion.span layoutId="admin-pill" className="absolute inset-0 rounded-md bg-plate" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
        <n.icon size={18} className="relative" /><span className="relative">{n.label}</span>
      </Link>)}</nav>
      <Link href="/portal" className="rounded-md border border-line px-3 py-2 text-center text-sm font-semibold">View member app</Link>
    </div></aside>
    <div className="min-w-0"><header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-chalk/90 px-4 py-3 backdrop-blur">
      <Link href="/" className="display text-xl lg:hidden">Rackhouse</Link>
      <select aria-label="Branch" className="rounded-md border border-line bg-surface px-3 py-2 text-sm font-semibold" defaultValue="pune"><option value="pune">Pune – Koregaon Park</option><option value="mumbai">Mumbai – Andheri</option></select>
      <div className="relative ml-auto hidden max-w-xs flex-1 sm:block"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input aria-label="Search members" placeholder="Search members" className="w-full rounded-md border border-line bg-surface py-2 pl-9 pr-3 text-sm" /></div>
      <button aria-label="Toggle dark mode" onClick={() => setDark((d) => !d)} className="ml-auto rounded-md border border-line bg-surface p-2 sm:ml-0">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
    </header>
    <nav className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line bg-surface px-3 py-2 lg:hidden">{nav.map((n) => <Link key={n.href} href={n.href} className={cn("shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold", active(n.href) ? "bg-plate text-white" : "text-muted")}>{n.label}</Link>)}</nav>
    <div className="p-4 sm:p-6">{children}</div></div>
  </div>;
}
