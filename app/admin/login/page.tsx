"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="container-prose py-16">
      <div className="mx-auto max-w-lg rounded-3xl bg-white/75 p-8 ring-1 ring-black/5 backdrop-blur">
        <div className="chip bg-brand-green text-white ring-0">TradMillet</div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-neutral-900">Admin Login</h1>
        <p className="mt-2 text-sm text-neutral-700">Sign in to manage products, prices, and orders.</p>

        <form
          className="mt-8 grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            setLoading(true);
            try {
              const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
              });
              const data = (await res.json().catch(() => null)) as any;
              if (!res.ok) throw new Error(data?.message || "Login failed");
              router.push("/admin");
            } catch (e2: any) {
              setErr(e2?.message || "Login failed");
            } finally {
              setLoading(false);
            }
          }}
        >
          <input
            className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />
          <input
            className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
          />
          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
          {err ? <div className="text-sm font-semibold text-red-700">{err}</div> : null}
          <div className="text-xs text-neutral-600">
            Set credentials in <code className="font-semibold">.env.local</code>: <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD</code>,
            and optionally <code>ADMIN_TOKEN_SECRET</code>.
          </div>
        </form>
      </div>
    </div>
  );
}


