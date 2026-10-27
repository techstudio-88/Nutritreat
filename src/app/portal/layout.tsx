"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, Dumbbell, Home, Salad, User } from "lucide-react";
import { cn } from "@/components/ui";
const tabs = [{ href: "/portal", label: "Home", icon: Home }, { href: "/portal/workout", label: "Workout", icon: Dumbbell }, { href: "/portal/diet", label: "Diet", icon: Salad }, { href: "/portal/book", label: "Book", icon: CalendarDays }, { href: "/portal/me", label: "Me", icon: User }];
export default function PortalLayout({ children }: { children: React.ReactNode }) {
 const path = usePathname();
 return <div className="mx-auto min-h-screen max-w-md bg-chalk pb-24 lg:my-6 lg:min-h-0 lg:overflow-hidden lg:rounded-3xl lg:border lg:border-line"><motion.main key={path} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className="px-4 pt-6">{children}</motion.main><nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md justify-around border-t border-line bg-surface/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">{tabs.map((t) => { const on = t.href === "/portal" ? path === "/portal" : path.startsWith(t.href); return <Link key={t.href} href={t.href} className="relative flex w-16 flex-col items-center gap-0.5 py-1">{on && <motion.span layoutId="portal-tab" className="absolute -top-2 h-1 w-8 rounded-full bg-plate" transition={{ type: "spring", stiffness: 500, damping: 34 }} />}<t.icon size={22} className={cn(on ? "text-plate" : "text-muted")} /><span className={cn("text-[11px] font-semibold", on ? "text-plate" : "text-muted")}>{t.label}</span></Link>; })}</nav></div>;
}
