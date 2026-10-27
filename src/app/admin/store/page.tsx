"use client";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Badge, Button, Card, PageHeader, Table, Toast, useToast } from "@/components/ui";
import { inventory } from "@/lib/demo";
export default function Store() {
 const { msg, show } = useToast(); const [cart, setCart] = useState<Record<string, number>>({});
 const total = inventory.reduce((s, i) => s + (cart[i.sku] ?? 0) * i.price, 0);
 const add = (sku: string, d: number) => setCart((c) => ({ ...c, [sku]: Math.max(0, (c[sku] ?? 0) + d) }));
 return <>
  <PageHeader title="Store" sub="Stock levels, margins and the front-desk till." />
  <div className="grid gap-4 lg:grid-cols-3"><Card className="p-5 lg:col-span-2"><h2 className="mb-2 font-bold">Inventory</h2><Table rows={inventory} cols={[{ h: "Item", c: (i) => <span className="font-semibold">{i.name}</span> }, { h: "Category", c: (i) => i.cat }, { h: "Stock", c: (i) => i.stock <= i.low ? <Badge tone="warn">{i.stock} low</Badge> : <span className="tabular">{i.stock}</span> }, { h: "Price", c: (i) => `₹${i.price}`, className: "tabular" }, { h: "Margin", c: (i) => `${Math.round(((i.price - i.cost) / i.price) * 100)}%`, className: "tabular" }]} /></Card>
  <Card className="p-5"><h2 className="mb-3 font-bold">Till</h2><ul className="space-y-2">{inventory.map((i) => <li key={i.sku} className="flex items-center gap-2 text-sm"><span className="flex-1">{i.name}</span><button aria-label={`Remove one ${i.name}`} onClick={() => add(i.sku, -1)} className="rounded border border-line p-1"><Minus size={12} /></button><span className="w-5 text-center tabular">{cart[i.sku] ?? 0}</span><button aria-label={`Add one ${i.name}`} onClick={() => add(i.sku, 1)} className="rounded border border-line p-1"><Plus size={12} /></button></li>)}</ul><div className="mt-4 flex items-center justify-between border-t border-line pt-4"><span className="font-semibold">Total</span><span className="text-2xl font-bold tabular">₹{total.toLocaleString("en-IN")}</span></div><Button className="mt-3 w-full" disabled={total === 0} onClick={() => { show(`Sale of ₹${total.toLocaleString("en-IN")} recorded`); setCart({}); }}>Take payment</Button></Card></div><Toast msg={msg} />
 </>;
}
