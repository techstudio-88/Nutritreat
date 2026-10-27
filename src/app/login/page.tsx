"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { getSupabase } from "@/lib/supabase/client";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function sendOtp() {
    const sb = getSupabase();
    if (!sb) return setMsg("Supabase keys are not set. Add them in Vercel to turn on login.");
    const { error } = await sb.auth.signInWithOtp({ phone: `+91${phone.replace(/\\D/g, "")}` });
    if (error) return setMsg(error.message);
    setSent(true);
    setMsg("We sent a 6-digit code by SMS.");
  }

  async function verify() {
    const sb = getSupabase();
    if (!sb) return;
    const { error } = await sb.auth.verifyOtp({ phone: `+91${phone.replace(/\\D/g, "")}`, token: otp, type: "sms" });
    if (error) return setMsg(error.message);
    window.location.href = "/portal";
  }

  async function google() {
    const sb = getSupabase();
    if (!sb) return setMsg("Supabase keys are not set. Add them in Vercel to turn on login.");
    await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/portal` } });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <Card className="w-full max-w-sm p-6">
        <Link href="/" className="display text-2xl">Rackhouse</Link>
        <h1 className="mt-6 text-xl font-bold">Log in</h1>
        <Button variant="ghost" className="mt-4 w-full" onClick={google}>Continue with Google</Button>
        <div className="my-5 border-t border-line" />
        <label className="text-sm font-semibold" htmlFor="phone">Mobile number</label>
        <div className="mt-1 flex gap-2">
          <span className="flex items-center rounded-md border border-line px-3 text-sm text-muted">+91</span>
          <input id="phone" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-md border border-line bg-transparent px-3 py-2" placeholder="98765 43210" />
        </div>
        {sent && <><label className="mt-4 block text-sm font-semibold" htmlFor="otp">6-digit code</label><input id="otp" inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1 w-full rounded-md border border-line bg-transparent px-3 py-2 tracking-widest" /></>}
        <Button className="mt-4 w-full" onClick={sent ? verify : sendOtp}>{sent ? "Verify code" : "Send code"}</Button>
        {msg && <p className="mt-3 text-sm text-muted">{msg}</p>}
        <p className="mt-6 text-sm text-muted">Just looking? <Link href="/admin" className="font-semibold text-plate">Open the owner demo</Link> or <Link href="/portal" className="font-semibold text-plate">member app</Link>.</p>
      </Card>
    </main>
  );
}
