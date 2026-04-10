"use client";

import useSWR from "swr";
import Link from "next/link";

type MeResponse = {
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  orders?: {
    id: string;
    createdAt: string;
    status: string;
    subtotal: number;
  }[];
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AccountPage() {
  const { data, isLoading, error, mutate } = useSWR<MeResponse>("/api/account/me", fetcher);

  const customer = data?.customer;
  const orders = data?.orders || [];

  return (
    <div className="container-prose py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">Your account</h1>
          <p className="mt-2 text-sm text-neutral-700">
            Manage your details and see all TradMillet orders. <span className="font-extrabold text-brand-brown">We love your love.</span>
          </p>
        </div>
        {customer ? (
          <button
            className="btn btn-secondary"
            onClick={async () => {
              await fetch("/api/auth/login", { method: "DELETE" });
              mutate();
            }}
          >
            Logout
          </button>
        ) : null}
      </div>

      {isLoading && !data ? <div className="mt-6 text-sm text-neutral-700">Loading your account…</div> : null}
      {error ? <div className="mt-6 text-sm font-semibold text-red-700">Failed to load account.</div> : null}

      {!customer && !isLoading ? (
        <div className="mt-6 rounded-2xl bg-white/70 p-6 text-sm text-neutral-700 ring-1 ring-black/5 backdrop-blur">
          You&apos;re not logged in.{" "}
          <Link href="/account/login" className="font-semibold text-brand-green hover:underline">
            Login
          </Link>{" "}
          or{" "}
          <Link href="/account/signup" className="font-semibold text-brand-green hover:underline">
            create an account
          </Link>
          .
        </div>
      ) : null}

      {customer ? (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur">
            <div className="text-sm font-extrabold text-neutral-900">Profile</div>
            <div className="mt-3 text-sm text-neutral-700">
              <div className="font-semibold">{customer.name}</div>
              <div className="mt-1 text-xs text-neutral-600">{customer.email}</div>
              <div className="mt-1 text-xs text-neutral-600">{customer.phone}</div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur md:col-span-2">
            <div className="text-sm font-extrabold text-neutral-900">Recent orders</div>
            <div className="mt-3 space-y-3 text-sm">
              {orders.length === 0 ? (
                <p className="text-neutral-700">
                  No orders yet.{" "}
                  <Link href="/products" className="font-semibold text-brand-green hover:underline">
                    Start shopping
                  </Link>
                  .
                </p>
              ) : (
                orders.map((o) => (
                  <div
                    key={o.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/5"
                  >
                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-neutral-600">Order</div>
                      <div className="mt-1 text-sm font-extrabold text-neutral-900">{o.id}</div>
                      <div className="mt-1 text-xs text-neutral-600">
                        Placed: {new Date(o.createdAt).toLocaleDateString()} · Status:{" "}
                        <span className="font-semibold capitalize">{o.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-extrabold text-brand-brown">₹{o.subtotal}</div>
                      <Link href={`/orders/track?id=${encodeURIComponent(o.id)}`} className="chip">
                        Track →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

