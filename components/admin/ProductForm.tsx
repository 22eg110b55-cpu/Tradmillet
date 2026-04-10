"use client";

import type { Product, ProductCategory } from "@/utils/types";
import { useMemo, useState } from "react";

const categories: { label: string; value: ProductCategory }[] = [
  { label: "Fitness", value: "fitness" },
  { label: "Kids", value: "kids" },
  { label: "Senior", value: "senior" },
  { label: "Peanut", value: "peanut" }
];

export function ProductForm({
  initial,
  onSaved
}: {
  initial?: Partial<Product>;
  onSaved?: (product: Product) => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [category, setCategory] = useState<ProductCategory>(initial?.category || "fitness");
  const [price, setPrice] = useState(String(initial?.price ?? 250));
  const [description, setDescription] = useState(initial?.description || "");
  const [ingredients, setIngredients] = useState((initial?.ingredients || []).join(", "));
  const [stock, setStock] = useState(String(initial?.stock ?? 50));
  const [image, setImage] = useState(initial?.image || "");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const id = initial?.id;

  const payload = useMemo(
    () => ({
      id,
      name,
      category,
      price: Number(price),
      description,
      ingredients: ingredients
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      stock: Number(stock),
      image
    }),
    [category, description, id, image, ingredients, name, price, stock]
  );

  return (
    <form
      className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur"
      onSubmit={async (e) => {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
          const res = await fetch(id ? `/api/products/${id}` : "/api/products", {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const data = (await res.json().catch(() => null)) as any;
          if (!res.ok) throw new Error(data?.message || "Failed to save");
          onSaved?.(data.product as Product);
        } catch (e2: any) {
          setErr(e2?.message || "Failed to save");
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-lg font-extrabold text-neutral-900">{id ? "Edit product" : "Add new product"}</div>
          <div className="mt-1 text-xs text-neutral-600">Prices and stock are fully owner-controlled.</div>
        </div>
        <button className="btn btn-primary md:w-auto" disabled={loading}>
          {loading ? "Saving..." : id ? "Save changes" : "Add Product"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-neutral-700 sm:col-span-2">
          Product Name
          <input className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-neutral-700">
          Category
          <select className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10" value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)}>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-neutral-700">
          Price (₹)
          <input className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10" value={price} onChange={(e) => setPrice(e.target.value)} required inputMode="numeric" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-neutral-700 sm:col-span-2">
          Description
          <textarea className="min-h-28 rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-neutral-700 sm:col-span-2">
          Ingredients (comma separated)
          <input className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-neutral-700">
          Stock Quantity
          <input className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10" value={stock} onChange={(e) => setStock(e.target.value)} required inputMode="numeric" />
        </label>
        <div className="grid gap-2 text-sm font-semibold text-neutral-700">
          Upload Image
          <input
            className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10"
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const fd = new FormData();
              fd.append("file", f);
              const res = await fetch("/api/upload", { method: "POST", body: fd });
              const data = (await res.json().catch(() => null)) as any;
              if (res.ok && data?.url) setImage(String(data.url));
              else setErr(data?.message || "Upload failed");
            }}
          />
        </div>
        <label className="grid gap-2 text-sm font-semibold text-neutral-700 sm:col-span-2">
          Image URL (auto-filled on upload)
          <input className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10" value={image} onChange={(e) => setImage(e.target.value)} placeholder="/uploads/your-image.png" />
        </label>
      </div>

      {err ? <div className="mt-4 text-sm font-semibold text-red-700">{err}</div> : null}
      <div className="mt-4 text-xs text-neutral-600">
        Note: Image upload writes to <code>public/uploads</code> (works locally). For Vercel production, switch to S3/Cloudinary storage.
      </div>
    </form>
  );
}


