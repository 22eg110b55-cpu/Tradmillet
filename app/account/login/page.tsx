"use client";

import { useState } from "react";
import Link from "next/link";

export default function AccountLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="container-prose py-12">
      <div className="mx-auto max-w-md rounded-3xl bg-white/75 p-8 ring-1 ring-black/5 backdrop-blur">
        <div className="chip bg-brand-green text-white ring-0">TradMillet</div>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-neutral-900">Customer login</h1>
        <p className="mt-2 text-sm text-neutral-700">
          Login to see your saved address and order history. <span className="font-extrabold text-brand-brown">We love your love.</span>
        </p>
        <form
          className="mt-6 grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            setLoading(true);
            try {
              const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
              });
              const data = (await res.json().catch(() => null)) as any;
              if (!res.ok) throw new Error(data?.message || "Login failed");
              window.location.href = "/account";
            } catch (e2: any) {
              setErr(e2?.message || "Login failed");
            } finally {
              setLoading(false);
            }
          }}
        >
          <input
            className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
          {err ? <div className="text-sm font-semibold text-red-700">{err}</div> : null}
        </form>
        <p className="mt-4 text-xs text-neutral-700">
          New to TradMillet?{" "}
          <Link href="/account/signup" className="font-semibold text-brand-green hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

