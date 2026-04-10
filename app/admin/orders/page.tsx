"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import type { Order, OrderStatus } from "@/utils/types";

const statuses: OrderStatus[] = ["pending", "processing", "packed", "shipped", "delivered"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [newAlert, setNewAlert] = useState(false);

  async function load() {
    setErr(null);
    const res = await fetch("/api/orders");
    const data = (await res.json().catch(() => null)) as any;
    if (!res.ok) {
      setErr(data?.message || "Failed to load orders");
      return;
    }
    setOrders((data?.orders || []) as Order[]);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let timer: any;
    let prevTopId = "";
    async function poll() {
      try {
        const res = await fetch("/api/orders");
        const data = (await res.json().catch(() => null)) as any;
        if (!res.ok) return;
        const next = (data?.orders || []) as Order[];
        const topId = next?.[0]?.id || "";
        if (prevTopId && topId && topId !== prevTopId) {
          setNewAlert(true);
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = "sine";
            o.frequency.value = 880;
            o.connect(g);
            g.connect(ctx.destination);
            g.gain.setValueAtTime(0.0001, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
            o.start();
            o.stop(ctx.currentTime + 0.36);
          } catch {
            // ignore
          }
        }
        prevTopId = topId;
        setOrders(next);
      } finally {
        timer = window.setTimeout(poll, 9000);
      }
    }
    poll();
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-lg font-extrabold text-neutral-900">Orders</div>
        {newAlert ? (
          <button
            className="chip bg-brand-orange text-white ring-0"
            onClick={() => {
              setNewAlert(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            🔔 New order received
          </button>
        ) : null}
      </div>
      {err ? <div className="mt-4 text-sm font-semibold text-red-700">{err}</div> : null}

      <div className="mt-6 overflow-hidden rounded-2xl bg-white/70 ring-1 ring-black/5 backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white">
              <tr className="text-xs font-extrabold text-neutral-700">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Subtotal</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-black/5">
                  <td className="p-4 font-extrabold text-neutral-900">{o.id}</td>
                  <td className="p-4 text-neutral-700">
                    <div className="font-semibold">{o.customer.name}</div>
                    <div className="text-xs text-neutral-500">{o.customer.phone}</div>
                  </td>
                  <td className="p-4 text-neutral-700">
                    <div className="grid gap-1">
                      {o.items.map((it) => (
                        <div key={`${o.id}_${it.productId}`} className="text-xs">
                          {it.productName} × {it.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 font-extrabold text-brand-brown">₹{o.subtotal}</td>
                  <td className="p-4">
                    <select
                      className="rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-black/10"
                      value={o.status}
                      onChange={async (e) => {
                        const status = e.target.value as OrderStatus;
                        await fetch(`/api/orders/${o.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status })
                        });
                        load();
                      }}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 ? (
                <tr>
                  <td className="p-6 text-neutral-700" colSpan={5}>
                    No orders yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}


