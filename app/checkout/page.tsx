"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import type { PaymentMethod } from "@/utils/types";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");

  const totalItems = useMemo(() => items.reduce((s, it) => s + it.quantity, 0), [items]);

  if (placed) {
    return (
      <div className="container-prose py-14">
        <div className="rounded-2xl bg-white/70 p-10 text-center ring-1 ring-black/5 backdrop-blur">
          <div className="text-2xl font-black tracking-tight text-neutral-900">Order placed!</div>
          <p className="mt-2 text-sm text-neutral-700">
            Thanks for choosing TradMillet Foods. Your order is confirmed and our team will contact you shortly for
            payment and delivery.
          </p>
          {orderId ? <div className="mt-3 text-sm font-extrabold text-brand-brown">Order ID: {orderId}</div> : null}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/products" className="btn btn-primary">
              Shop more
            </Link>
            <Link href="/" className="btn btn-secondary">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-prose py-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">Checkout</h1>
          <p className="mt-2 text-sm text-neutral-700">Enter your details and confirm your order.</p>
        </div>
        <Link href="/cart" className="text-sm font-semibold text-brand-green hover:underline">
          ← Back to cart
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <form
          className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur lg:col-span-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            if (items.length === 0) return;
            setLoading(true);
            const form = new FormData(e.currentTarget);
            const payload = {
              customer: {
                name: String(form.get("name") || ""),
                phone: String(form.get("phone") || ""),
                email: String(form.get("email") || ""),
                address: String(form.get("address") || "")
              },
              items: items.map((it) => ({ productId: it.product.id, quantity: it.quantity })),
              paymentMethod
            };
            try {
              if (paymentMethod === "razorpay") {
                const r1 = await fetch("/api/payment/create-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload)
                });
                const d1 = (await r1.json().catch(() => null)) as any;
                if (!r1.ok) throw new Error(d1?.message || "Failed to start payment");

                if (!window.Razorpay) {
                  await new Promise<void>((resolve, reject) => {
                    const s = document.createElement("script");
                    s.src = "https://checkout.razorpay.com/v1/checkout.js";
                    s.async = true;
                    s.onload = () => resolve();
                    s.onerror = () => reject(new Error("Failed to load Razorpay"));
                    document.body.appendChild(s);
                  });
                }

                const options = {
                  key: d1.keyId,
                  amount: d1.amount,
                  currency: d1.currency,
                  name: "TradMillet Foods",
                  description: "Healthy millet nutrition",
                  order_id: d1.razorpayOrderId,
                  prefill: {
                    name: payload.customer.name,
                    email: payload.customer.email,
                    contact: payload.customer.phone
                  },
                  theme: { color: "#2E7D32" },
                  handler: async (response: any) => {
                    const r2 = await fetch("/api/payment/verify", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        ...response,
                        customer: payload.customer,
                        items: payload.items
                      })
                    });
                    const d2 = (await r2.json().catch(() => null)) as any;
                    if (!r2.ok) throw new Error(d2?.message || "Payment verification failed");
                    setOrderId(String(d2?.order?.id || ""));
                    clearCart();
                    setPlaced(true);
                  }
                };

                const rz = new window.Razorpay(options);
                rz.on("payment.failed", (resp: any) => {
                  setErr(resp?.error?.description || "Payment failed");
                });
                rz.open();
              } else {
                const res = await fetch("/api/orders", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload)
                });
                const data = (await res.json().catch(() => null)) as any;
                if (!res.ok) throw new Error(data?.message || "Failed to place order");
                setOrderId(String(data?.order?.id || ""));
                clearCart();
                setPlaced(true);
              }
            } catch (e2: any) {
              setErr(e2?.message || "Something went wrong");
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="text-lg font-extrabold text-neutral-900">Shipping & payment details</div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <input
              name="name"
              className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10"
              placeholder="Full name"
              required
            />
            <input
              name="phone"
              className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10"
              placeholder="Phone number"
              required
            />
            <input
              name="email"
              className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10 sm:col-span-2"
              placeholder="Email"
              type="email"
              required
            />
            <input
              name="address"
              className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10 sm:col-span-2"
              placeholder="Address"
              required
            />
            <input className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10" placeholder="City" required />
            <input className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10" placeholder="Pincode" required />
          </div>
          <div className="mt-6 rounded-2xl bg-brand-cream/70 p-4 text-xs ring-1 ring-brand-brown/15">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-brown">
              Secure & flexible payment
            </div>
            <p className="mt-2 text-[13px] text-neutral-700">
              Pay safely by UPI / bank transfer or on delivery. Once you place the order, you&apos;ll receive payment
              details and updates on WhatsApp or SMS.
            </p>
          </div>
          <div className="mt-6 rounded-2xl bg-white/70 p-4 ring-1 ring-black/5">
            <div className="text-sm font-extrabold text-neutral-900">Choose payment</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                { id: "razorpay", label: "UPI / Card / NetBanking (Razorpay)", hint: "Instant confirmation" },
                { id: "cod", label: "Cash on Delivery", hint: "Pay at delivery" },
                { id: "bank_transfer", label: "Manual Bank Transfer", hint: "We share account details" }
              ].map((m) => (
                <label
                  key={m.id}
                  className={
                    paymentMethod === (m.id as PaymentMethod)
                      ? "flex cursor-pointer items-start gap-3 rounded-2xl bg-brand-cream/60 p-4 ring-1 ring-brand-brown/15"
                      : "flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/10 hover:bg-black/[0.02]"
                  }
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    className="mt-1"
                    checked={paymentMethod === (m.id as PaymentMethod)}
                    onChange={() => setPaymentMethod(m.id as PaymentMethod)}
                  />
                  <span className="grid gap-1">
                    <span className="text-sm font-extrabold text-neutral-900">{m.label}</span>
                    <span className="text-xs text-neutral-600">{m.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <button disabled={items.length === 0 || loading} className="btn btn-primary w-full disabled:opacity-50">
              {loading ? "Please wait..." : paymentMethod === "razorpay" ? "Pay & Place Order" : "Place order"}
            </button>
            {items.length === 0 ? (
              <p className="mt-2 text-xs text-neutral-600">Your cart is empty. Add products before checking out.</p>
            ) : null}
            {err ? <p className="mt-2 text-xs font-semibold text-red-700">{err}</p> : null}
          </div>
        </form>

        <div className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur">
          <div className="text-lg font-extrabold text-neutral-900">Order summary</div>
          <div className="mt-4 space-y-2 text-sm">
            {items.map((it) => (
              <div key={it.product.slug} className="flex justify-between gap-3">
                <span className="text-neutral-700">
                  {it.product.name} <span className="text-neutral-500">× {it.quantity}</span>
                </span>
                <span className="font-extrabold text-neutral-900">₹{it.product.price * it.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-black/10 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-700">Items</span>
              <span className="font-extrabold text-neutral-900">{totalItems}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-neutral-700">Total</span>
              <span className="font-extrabold text-brand-brown">₹{subtotal}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            You&apos;ll receive payment instructions and live order updates once your order is confirmed.
          </p>
        </div>
      </div>
    </div>
  );
}


