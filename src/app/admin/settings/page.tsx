"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Button, Card, PageHeader, Toast, Toggle, useToast } from "@/components/ui";

export default function Settings() {
  const { msg } = useToast();
  const [twofa, setTwofa] = useState(true);
  const [geo, setGeo] = useState(false);
  const [autoOut, setAutoOut] = useState(true);

  return (
    <>
      <PageHeader title="Settings" sub="Branding, security and the rules for your front desk." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-1 font-bold">Branding and member app</h2>
          <p className="mb-4 text-sm text-muted">Colours, fonts, tabs, plans and classes now live in the Design studio. Changes save by themselves and reach members live.</p>
          <Link href="/admin/studio">
            <Button>Open Design studio</Button>
          </Link>
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 font-bold">Security and rules</h2>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center justify-between">
              Require two-step login for admins <Toggle on={twofa} onChange={setTwofa} label="Two-step login" />
            </li>
            <li className="flex items-center justify-between">
              Only allow check-in inside the gym (GPS) <Toggle on={geo} onChange={setGeo} label="Geofence" />
            </li>
            <li className="flex items-center justify-between">
              Check members out after 3 hours <Toggle on={autoOut} onChange={setAutoOut} label="Auto check-out" />
            </li>
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 font-bold">Region</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted">Currency</p>
              <p className="font-semibold">INR (₹)</p>
            </div>
            <div>
              <p className="text-muted">Time zone</p>
              <p className="font-semibold">Asia/Kolkata</p>
            </div>
            <div>
              <p className="text-muted">Tax</p>
              <p className="font-semibold">GST 18%</p>
            </div>
            <div>
              <p className="text-muted">Languages</p>
              <p className="font-semibold">English, Hindi</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 font-bold">Integrations</h2>
          <ul className="space-y-3 text-sm">
            {[
              ["Razorpay payments", "Not connected"],
              ["WhatsApp Business", "Not connected"],
              ["Custom domain", "Not set"],
            ].map(([n, s]) => (
              <li key={n} className="flex items-center justify-between">
                {n} <Badge>{s}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Toast msg={msg} />
    </>
  );
}
