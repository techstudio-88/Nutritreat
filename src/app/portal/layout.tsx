"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/components/ui";
import { useApp } from "@/components/app-provider";
import { BrandMark, TAB_HREF, TAB_ICONS } from "@/components/member-ui";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { config, auth } = useApp();
  const tabs = config.member.tabs.filter((t) => t.enabled);

  return (
    <div className="mx-auto min-h-screen max-w-md pb-24 lg:my-6 lg:min-h-0 lg:overflow-hidden lg:rounded-[2rem] lg:border lg:border-line lg:bg-chalk/70 lg:backdrop-blur">
      <header className="flex items-center justify-between px-4 pt-5">
        <div className="flex items-center gap-2">
          <BrandMark />
          <span className="display text-xl">{config.brand.name}</span>
        </div>
        {auth.ready && !auth.userId && (
          <Link href="/login" className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">
            Demo · Log in
          </Link>
        )}
      </header>
      <motion.main
        key={path}
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.28 }}
        className="px-4 pt-5"
      >
        {children}
      </motion.main>
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-3 z-40 mx-auto flex max-w-[22rem] justify-around rounded-full border border-line bg-surface/80 px-2 py-2 shadow-2xl backdrop-blur-xl"
      >
        {tabs.map((t) => {
          const href = TAB_HREF[t.id];
          const on = href === "/portal" ? path === "/portal" : path.startsWith(href);
          const Icon = TAB_ICONS[t.id];
          return (
            <Link key={t.id} href={href} className="relative flex min-w-14 flex-col items-center gap-0.5 rounded-full px-3 py-1.5">
              {on && (
                <motion.span
                  layoutId="portal-tab"
                  className="absolute inset-0 rounded-full bg-plate"
                  transition={{ type: "spring", stiffness: 500, damping: 34 }}
                />
              )}
              <Icon size={20} className={cn("relative", on ? "text-onplate" : "text-muted")} />
              <span className={cn("relative text-[10px] font-semibold", on ? "text-onplate" : "text-muted")}>{t.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
