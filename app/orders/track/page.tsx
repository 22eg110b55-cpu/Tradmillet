"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { OrderStatus } from "@/utils/types";

const steps: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" }
];

export default function TrackOrderPage() {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [order, setOrder] = useState<any | null>(null);

  const activeIdx = useMemo(() => {
    const s = (order?.status || "pending") as OrderStatus;
    return Math.max(0, steps.findIndex((x) => x.key === s));
  }, [order?.status]);

  return (
    <div className="container-prose py-12">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">Track your order</h1>
          <p className="mt-2 text-sm text-neutral-700">
            Enter your Order ID to see status updates. <span className="font-extrabold text-brand-brown">We love your love</span>.
          </p>
        </div>
        <Link href="/products" className="text-sm font-semibold text-brand-green hover:underline">
          Shop more →
        </Link>
      </div>

      <form
        className="mt-8 flex flex-col gap-3 rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur sm:flex-row sm:items-center"
        onSubmit={async (e) => {
          e.preventDefault();
          setErr(null);
          setLoading(true);
          setOrder(null);
          try {
            const res = await fetch(`/api/orders/track/${encodeURIComponent(id.trim())}`);
            const data = (await res.json().catch(() => null)) as any;
            if (!res.ok) throw new Error(data?.message || "Not found");
            setOrder(data?.order || null);
          } catch (e2: any) {
            setErr(e2?.message || "Failed to track order");
          } finally {
            setLoading(false);
          }
        }}
      >
        <input
          className="flex-1 rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10"
          placeholder="Order ID (example: ord_...)"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <button className="btn btn-primary sm:w-auto" disabled={loading}>
          {loading ? "Checking..." : "Track order"}
        </button>
      </form>

      {err ? <div className="mt-4 text-sm font-semibold text-red-700">{err}</div> : null}

      {order ? (
        <div className="mt-8 rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-neutral-600">Order</div>
              <div className="mt-1 text-base font-extrabold text-neutral-900">{order.id}</div>
              <div className="mt-1 text-xs text-neutral-600">Placed: {new Date(order.createdAt).toLocaleString()}</div>
            </div>
            <div className="rounded-2xl bg-brand-cream/70 px-4 py-3 ring-1 ring-brand-brown/15">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-brown">Payment</div>
              <div className="mt-1 text-sm font-extrabold text-neutral-900">
                {(order.payment?.method || "cod").toUpperCase()} · {(order.payment?.status || "unpaid").toUpperCase()}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="grid gap-3 sm:grid-cols-5">
              {steps.map((s, idx) => {
                const done = idx <= activeIdx;
                return (
                  <div
                    key={s.key}
                    className={
                      done
                        ? "rounded-2xl bg-white px-4 py-3 text-center ring-1 ring-brand-green/25"
                        : "rounded-2xl bg-white/50 px-4 py-3 text-center ring-1 ring-black/5"
                    }
                  >
                    <div className={done ? "text-sm font-extrabold text-brand-green" : "text-sm font-extrabold text-neutral-500"}>
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-neutral-600">
              Live making of the millet is provided—your nutrition is crafted with care.
            </p>
          </div>

          <div className="mt-6 border-t border-black/10 pt-5">
            <div className="text-sm font-extrabold text-neutral-900">Items</div>
            <div className="mt-3 grid gap-2 text-sm text-neutral-700">
              {(order.items || []).map((it: any, i: number) => (
                <div key={`${it.productName}_${i}`} className="flex justify-between gap-3">
                  <span>
                    {it.productName} <span className="text-neutral-500">× {it.quantity}</span>
                  </span>
                  <span className="font-extrabold text-neutral-900">₹{it.lineTotal}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-neutral-700">Total</span>
              <span className="font-extrabold text-brand-brown">₹{order.subtotal}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

