"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import type { Product } from "@/utils/types";
import Image from "next/image";
import { Trash2 } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    const res = await fetch("/api/products");
    const data = (await res.json().catch(() => null)) as any;
    if (!res.ok) {
      setErr(data?.message || "Failed to load products");
      return;
    }
    setProducts((data?.products || []) as Product[]);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminShell>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-lg font-extrabold text-neutral-900">Products</div>
        <Link href="/admin/products/new" className="btn btn-primary md:w-auto">
          Add Product
        </Link>
      </div>

      {err ? <div className="mt-4 text-sm font-semibold text-red-700">{err}</div> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {products.map((p) => (
          <div key={p.id} className="rounded-2xl bg-white/70 p-4 ring-1 ring-black/5 backdrop-blur">
            <div className="flex gap-4">
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-cream">
                <Image src={p.image} alt={p.name} fill className="object-contain p-3" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-extrabold text-neutral-900">{p.name}</div>
                    <div className="mt-1 text-xs font-semibold text-neutral-600 capitalize">
                      {p.category} · ₹{p.price} · Stock {p.stock}
                    </div>
                  </div>
                  <button
                    className="rounded-xl p-2 hover:bg-black/5"
                    aria-label="Delete product"
                    onClick={async () => {
                      if (!confirm("Delete this product?")) return;
                      await fetch(`/api/products/${p.id}`, { method: "DELETE" });
                      load();
                    }}
                  >
                    <Trash2 className="h-5 w-5 text-neutral-700" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href={`/products/${p.slug}`} className="chip hover:bg-white">
                    View
                  </Link>
                  <Link href={`/admin/products/${p.id}/edit`} className="chip bg-brand-orange text-white ring-0">
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white/70 p-6 text-sm text-neutral-700 ring-1 ring-black/5 backdrop-blur">
          No products yet. Click <span className="font-extrabold">Add Product</span> to create your first item.
        </div>
      ) : null}
    </AdminShell>
  );
}


