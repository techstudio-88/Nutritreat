"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, cn } from "@/components/ui";
import { Barbell, useApp } from "@/components/app-provider";
import { getSupabase } from "@/lib/supabase/client";

const field = "w-full rounded-ctl border border-line bg-transparent px-3 py-2.5 text-sm";

export default function Login() {
  const { auth, refreshAuth, signOut } = useApp();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [gymName, setGymName] = useState("");
  const [role, setRole] = useState<"owner" | "member">("owner");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ t: string; bad?: boolean } | null>(null);

  // An invite link looks like /login?code=ABC123
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("code");
    if (c) {
      setCode(c.toUpperCase());
      setRole("member");
      setMode("signup");
    }
  }, []);

  // Signed in with a gym already: send them to the right app.
  useEffect(() => {
    if (auth.ready && auth.userId && auth.gymId) {
      window.location.href = auth.role === "member" ? "/portal" : "/admin";
    }
  }, [auth.ready, auth.userId, auth.gymId, auth.role]);

  const sb = getSupabase();
  const bad = (t: string) => setMsg({ t, bad: true });

  async function submit() {
    if (!sb) return bad("The app isn't connected to its database yet.");
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signup") {
        const { data, error } = await sb.auth.signUp({
          email,
          password,
          options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/login` },
        });
        if (error) return bad(error.message);
        if (!data.session) return setMsg({ t: "Check your email and click the confirmation link, then log in." });
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) return bad(error.message);
      }
      await refreshAuth();
    } finally {
      setBusy(false);
    }
  }

  async function magic() {
    if (!sb) return bad("The app isn't connected to its database yet.");
    if (!email) return bad("Enter your email first.");
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/login` } });
    if (error) return bad(error.message);
    setMsg({ t: "We emailed you a login link." });
  }

  async function google() {
    if (!sb) return bad("The app isn't connected to its database yet.");
    const { error } = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/login` } });
    if (error) bad(error.message);
  }

  async function finishSetup() {
    if (!sb) return;
    setBusy(true);
    setMsg(null);
    const { error } = role === "owner" ? await sb.rpc("create_gym", { gym_name: gymName }) : await sb.rpc("join_gym", { code });
    setBusy(false);
    if (error) return bad(error.message);
    await refreshAuth();
  }

  const needsSetup = auth.ready && !!auth.userId && !auth.gymId;

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
        <Link href="/" className="display text-3xl">
          Rackhouse
        </Link>
        <div>
          <Barbell size={180} />
          <h1 className="display mt-6 text-[7rem]">
            Make it
            <br />
            your gym.
          </h1>
          <p className="mt-4 max-w-sm text-muted">Colours, tabs, plans, classes. Change them once and every member sees it.</p>
        </div>
        <p className="text-sm text-muted">Free to start. No card needed.</p>
      </section>

      <section className="flex items-center justify-center p-5">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-sm p-6">
          <Link href="/" className="display text-2xl lg:hidden">
            Rackhouse
          </Link>

          <AnimatePresence mode="wait">
            {needsSetup ? (
              <motion.div key="setup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="mt-2 text-xl font-bold">One last step</h2>
                <p className="text-sm text-muted">Signed in as {auth.email}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {(
                    [
                      ["owner", "I run a gym"],
                      ["member", "I'm a member"],
                    ] as const
                  ).map(([v, l]) => (
                    <button
                      key={v}
                      onClick={() => setRole(v)}
                      className={cn(
                        "rounded-ctl border px-3 py-3 text-sm font-semibold transition",
                        role === v ? "glow-btn border-plate bg-plate text-onplate" : "border-line text-muted hover:text-ink",
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                {role === "owner" ? (
                  <div className="mt-4">
                    <label htmlFor="gym" className="text-sm font-semibold">
                      Gym name
                    </label>
                    <input id="gym" className={cn(field, "mt-1")} value={gymName} onChange={(e) => setGymName(e.target.value)} placeholder="Iron District" />
                  </div>
                ) : (
                  <div className="mt-4">
                    <label htmlFor="code" className="text-sm font-semibold">
                      Gym code
                    </label>
                    <input
                      id="code"
                      className={cn(field, "mt-1 uppercase tracking-widest")}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Ask your gym for the 6-character code"
                    />
                  </div>
                )}
                <Button className="mt-4 w-full" onClick={finishSetup} disabled={busy || (role === "owner" ? !gymName.trim() : code.trim().length < 4)}>
                  {role === "owner" ? "Create my gym" : "Join my gym"}
                </Button>
                <button onClick={signOut} className="mt-3 w-full text-center text-sm text-muted underline">
                  Use a different account
                </button>
              </motion.div>
            ) : (
              <motion.div key="auth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="mt-3 grid grid-cols-2 rounded-ctl border border-line p-1 text-sm font-semibold">
                  {(
                    [
                      ["login", "Log in"],
                      ["signup", "Sign up"],
                    ] as const
                  ).map(([v, l]) => (
                    <button
                      key={v}
                      onClick={() => setMode(v)}
                      className={cn("rounded-ctl py-2 transition", mode === v ? "bg-plate text-onplate" : "text-muted")}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                <Button variant="ghost" className="mt-4 w-full" onClick={google}>
                  Continue with Google
                </Button>
                <div className="my-4 flex items-center gap-3 text-xs text-muted">
                  <span className="h-px flex-1 bg-line" /> or use email <span className="h-px flex-1 bg-line" />
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                  className="space-y-3"
                >
                  {mode === "signup" && (
                    <input aria-label="Your name" className={field} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
                  )}
                  <input aria-label="Email" type="email" className={field} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <input
                    aria-label="Password"
                    type="password"
                    className={field}
                    placeholder="Password (6+ characters)"
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? "One moment…" : mode === "signup" ? "Create account" : "Log in"}
                  </Button>
                </form>
                <button onClick={magic} className="mt-3 w-full text-center text-sm font-semibold text-plate">
                  Email me a login link instead
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {msg && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="status" className={cn("mt-4 rounded-ctl p-3 text-sm", msg.bad ? "bg-ember/15 text-ember" : "bg-mat/15 text-mat")}>
              {msg.t}
            </motion.p>
          )}

          <p className="mt-6 text-sm text-muted">
            Just looking?{" "}
            <Link href="/admin" className="font-semibold text-plate">
              Owner demo
            </Link>{" "}
            ·{" "}
            <Link href="/portal" className="font-semibold text-plate">
              Member demo
            </Link>
          </p>
        </motion.div>
      </section>
    </main>
  );
}
