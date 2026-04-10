import { NextResponse } from "next/server";
import { deleteProduct, getProductById, normalizeCategory, upsertProduct } from "@/lib/db/productsDb";
import { requireAdmin } from "@/lib/auth/adminAuth";
import type { Product } from "@/utils/types";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) return NextResponse.json({ message: "Not Found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdmin()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as Partial<Product> | null;
  const existing = await getProductById(params.id);
  if (!existing) return NextResponse.json({ message: "Not Found" }, { status: 404 });

  const merged: Product = {
    ...existing,
    ...body,
    id: existing.id,
    category: body?.category ? normalizeCategory(String(body.category)) : existing.category,
    price: body?.price != null ? Number(body.price) : existing.price,
    stock: body?.stock != null ? Number(body.stock) : existing.stock,
    ingredients: Array.isArray(body?.ingredients) ? body!.ingredients!.map(String) : existing.ingredients
  };

  const saved = await upsertProduct(merged);
  return NextResponse.json({ product: saved });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!requireAdmin()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const ok = await deleteProduct(params.id);
  return NextResponse.json({ ok });
}


