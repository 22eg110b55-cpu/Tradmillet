"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Product } from "@/utils/types";

export default function AdminEditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    (async () => {
      setErr(null);
      const res = await fetch(`/api/products/${id}`);
      const data = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setErr(data?.message || "Failed to load product");
        return;
      }
      setProduct(data.product as Product);
    })();
  }, [params]);

  return (
    <AdminShell>
      {err ? <div className="text-sm font-semibold text-red-700">{err}</div> : null}
      {product ? (
        <ProductForm
          initial={product}
          onSaved={() => {
            router.push("/admin");
          }}
        />
      ) : (
        <div className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur">Loading...</div>
      )}
    </AdminShell>
  );
}


