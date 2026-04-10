import { NextResponse } from "next/server";
import { listProducts, normalizeCategory, upsertProduct } from "@/lib/db/productsDb";
import { requireAdmin } from "@/lib/auth/adminAuth";
import type { Product } from "@/utils/types";

export async function GET() {
  const products = await listProducts();
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  if (!requireAdmin()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as Partial<Product> | null;
  if (!body?.name || !body?.price || !body?.category) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const id = body.id || cryptoRandomId("prod_");
  const slug = body.slug || slugify(body.name);

  const product: Product = {
    id,
    name: String(body.name),
    slug,
    category: normalizeCategory(String(body.category)),
    description: String(body.description || ""),
    price: Number(body.price),
    rating: Number(body.rating || 4.6),
    image: String(body.image || "/products/gym-power-millet-mix.svg"),
    ingredients: Array.isArray(body.ingredients) ? body.ingredients.map(String) : [],
    stock: Number(body.stock ?? 0),
    nutritionFacts: body.nutritionFacts || {
      servingSize: "30g",
      calories: 120,
      protein: "6g",
      carbs: "18g",
      fiber: "4g",
      fat: "3g"
    },
    benefits: Array.isArray(body.benefits) ? body.benefits.map(String) : [],
    preparation: Array.isArray(body.preparation) ? body.preparation.map(String) : []
  };

  const saved = await upsertProduct(product);
  return NextResponse.json({ product: saved }, { status: 201 });
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function cryptoRandomId(prefix = "") {
  // Node 18+ has crypto.randomUUID; keep simple.
  return `${prefix}${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}


