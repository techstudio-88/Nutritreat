"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { applyTheme, DEFAULT_CONFIG, mergeConfig, type AppConfig } from "@/lib/config";
import { getSupabase } from "@/lib/supabase/client";

export type Auth = {
  ready: boolean;
  userId: string | null;
  email: string | null;
  fullName: string | null;
  role: string | null;
  gymId: string | null;
  gymName: string | null;
  inviteCode: string | null;
};
export type SaveStatus = "demo" | "saving" | "saved" | "error";

type Ctx = {
  config: AppConfig;
  update: (fn: (c: AppConfig) => AppConfig) => void;
  undo: () => void;
  canUndo: boolean;
  reset: () => void;
  status: SaveStatus;
  auth: Auth;
  canEdit: boolean;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
};

const empty: Auth = { ready: false, userId: null, email: null, fullName: null, role: null, gymId: null, gymName: null, inviteCode: null };
const AppCtx = createContext<Ctx | null>(null);

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
}

const CACHE = "rh-config-v1";
const STAFF = ["owner", "branch_manager", "trainer", "front_desk", "accountant"];

export function AppProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [auth, setAuth] = useState<Auth>(empty);
  const [status, setStatus] = useState<SaveStatus>("demo");
  const [history, setHistory] = useState<AppConfig[]>([]);
  const [booting, setBooting] = useState(true);

  const configRef = useRef(config);
  const authRef = useRef(auth);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSaved = useRef<string>("");
  const lastPush = useRef(0);
  configRef.current = config;
  authRef.current = auth;

  const canEdit = !!auth.userId && !!auth.gymId && !!auth.role && STAFF.includes(auth.role);

  // 1. Show cached look instantly (no flash), then load the real account.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CACHE);
      if (raw) setConfig(mergeConfig(JSON.parse(raw)));
    } catch {}
  }, []);

  useEffect(() => {
    applyTheme(config);
    try {
      localStorage.setItem(CACHE, JSON.stringify(config));
    } catch {}
  }, [config]);

  const loadAuth = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) {
      setAuth({ ...empty, ready: true });
      return;
    }
    const { data } = await sb.auth.getSession();
    const user = data.session?.user;
    if (!user) {
      setAuth({ ...empty, ready: true });
      return;
    }
    const { data: p } = await sb.from("profiles").select("role,gym_id,full_name").eq("id", user.id).maybeSingle();
    let gymName: string | null = null;
    let inviteCode: string | null = null;
    if (p?.gym_id) {
      const { data: g } = await sb.from("gyms").select("name,invite_code").eq("id", p.gym_id).maybeSingle();
      gymName = g?.name ?? null;
      inviteCode = g?.invite_code ?? null;
      const { data: s } = await sb.from("gym_settings").select("config").eq("gym_id", p.gym_id).maybeSingle();
      if (s?.config && Object.keys(s.config).length) {
        const merged = mergeConfig(s.config);
        lastSaved.current = JSON.stringify(merged);
        setConfig(merged);
      } else if (gymName) {
        // brand-new gym: start from defaults with its own name
        setConfig((c) => ({ ...c, brand: { ...c.brand, name: gymName! } }));
      }
      setStatus("saved");
    }
    setAuth({
      ready: true,
      userId: user.id,
      email: user.email ?? null,
      fullName: p?.full_name || (user.user_metadata?.full_name as string | undefined) || null,
      role: p?.role ?? null,
      gymId: p?.gym_id ?? null,
      gymName,
      inviteCode,
    });
  }, []);

  useEffect(() => {
    loadAuth();
    const sb = getSupabase();
    if (!sb) return;
    const { data: sub } = sb.auth.onAuthStateChange(() => {
      loadAuth();
    });
    return () => sub.subscription.unsubscribe();
  }, [loadAuth]);

  // 2. Live sync: when the owner saves, every open member app updates.
  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !auth.gymId) return;
    const ch = sb
      .channel(`gym_settings:${auth.gymId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "gym_settings", filter: `gym_id=eq.${auth.gymId}` },
        (payload) => {
          const next = mergeConfig((payload.new as { config?: unknown } | undefined)?.config);
          const str = JSON.stringify(next);
          if (str === lastSaved.current || str === JSON.stringify(configRef.current)) return;
          lastSaved.current = str;
          setConfig(next);
        },
      )
      .subscribe();
    return () => {
      sb.removeChannel(ch);
    };
  }, [auth.gymId]);

  // 3. Autosave (debounced).
  const scheduleSave = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    const a = authRef.current;
    if (!a.userId || !a.gymId || !a.role || !STAFF.includes(a.role)) {
      setStatus("demo");
      return;
    }
    setStatus("saving");
    timer.current = setTimeout(async () => {
      const sb = getSupabase();
      if (!sb) return;
      const snapshot = configRef.current;
      lastSaved.current = JSON.stringify(snapshot);
      const { error } = await sb
        .from("gym_settings")
        .upsert({ gym_id: a.gymId, config: snapshot, updated_at: new Date().toISOString(), updated_by: a.userId });
      setStatus(error ? "error" : "saved");
    }, 700);
  }, []);

  const update = useCallback(
    (fn: (c: AppConfig) => AppConfig) => {
      const now = Date.now();
      if (now - lastPush.current > 900) {
        const before = configRef.current;
        setHistory((h) => [...h.slice(-29), before]);
      }
      lastPush.current = now;
      setConfig((c) => fn(c));
      setTimeout(scheduleSave, 0);
    },
    [scheduleSave],
  );

  const undo = useCallback(() => {
    setHistory((h) => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setConfig(prev);
      setTimeout(scheduleSave, 0);
      return h.slice(0, -1);
    });
  }, [scheduleSave]);

  const reset = useCallback(() => {
    update(() => ({ ...DEFAULT_CONFIG, brand: { ...DEFAULT_CONFIG.brand, name: authRef.current.gymName ?? DEFAULT_CONFIG.brand.name } }));
  }, [update]);

  const signOut = useCallback(async () => {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    setAuth({ ...empty, ready: true });
    setStatus("demo");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1100);
    return () => clearTimeout(t);
  }, []);

  const value = useMemo<Ctx>(
    () => ({ config, update, undo, canUndo: history.length > 0, reset, status, auth, canEdit, signOut, refreshAuth: loadAuth }),
    [config, update, undo, history.length, reset, status, auth, canEdit, signOut, loadAuth],
  );

  return (
    <AppCtx.Provider value={value}>
      <MotionConfig reducedMotion={config.brand.motion ? "user" : "always"}>
        {children}
        <AnimatePresence>
          {booting && (
            <motion.div
              key="splash"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-chalk"
              aria-hidden
            >
              <Barbell />
              <p className="display mt-6 text-3xl">{config.brand.name}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </AppCtx.Provider>
  );
}

/** Animated barbell used for the splash screen and loading states. */
export function Barbell({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.4} viewBox="0 0 120 48" aria-hidden>
      <motion.rect x="10" y="21" width="100" height="6" rx="3" fill="rgb(var(--muted))" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ originX: 0.5 }} transition={{ duration: 0.4 }} />
      {[
        { x: 24, h: 40, c: "rgb(var(--plate))" },
        { x: 34, h: 30, c: "rgb(var(--ember))" },
        { x: 86, h: 30, c: "rgb(var(--ember))" },
        { x: 92, h: 40, c: "rgb(var(--plate))" },
      ].map((p, i) => (
        <motion.rect
          key={i}
          x={p.x}
          y={24 - p.h / 2}
          width="8"
          height={p.h}
          rx="2"
          fill={p.c}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 24 - p.h / 2, opacity: 1 }}
          transition={{ delay: 0.25 + i * 0.12, type: "spring", stiffness: 260, damping: 14 }}
        />
      ))}
    </svg>
  );
}
