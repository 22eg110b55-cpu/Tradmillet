import type { Product, ProductCategory } from "@/utils/types";
import { dataPath, readJsonFile, withWriteLock, writeJsonFile } from "@/lib/db/fileDb";

const PRODUCTS_FILE = dataPath("products.json");

function nowIso() {
  return new Date().toISOString();
}

export async function listProducts(): Promise<Product[]> {
  return readJsonFile<Product[]>(PRODUCTS_FILE, []);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const all = await listProducts();
  return all.find((p) => p.id === id);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const all = await listProducts();
  return all.find((p) => p.slug === slug);
}

export async function upsertProduct(input: Product): Promise<Product> {
  return withWriteLock(PRODUCTS_FILE, async () => {
    const all = await listProducts();
    const idx = all.findIndex((p) => p.id === input.id);
    const stamp = nowIso();
    const product: Product =
      idx >= 0
        ? { ...all[idx], ...input, updatedAt: stamp }
        : { ...input, createdAt: stamp, updatedAt: stamp };

    const next = idx >= 0 ? all.map((p) => (p.id === input.id ? product : p)) : [product, ...all];
    await writeJsonFile(PRODUCTS_FILE, next);
    return product;
  });
}

export async function deleteProduct(id: string): Promise<boolean> {
  return withWriteLock(PRODUCTS_FILE, async () => {
    const all = await listProducts();
    const next = all.filter((p) => p.id !== id);
    const changed = next.length !== all.length;
    if (changed) await writeJsonFile(PRODUCTS_FILE, next);
    return changed;
  });
}

export async function decrementStock(lines: { productId: string; quantity: number }[]) {
  return withWriteLock(PRODUCTS_FILE, async () => {
    const all = await listProducts();
    const next = all.map((p) => {
      const line = lines.find((l) => l.productId === p.id);
      if (!line) return p;
      const stock = Math.max(0, Number(p.stock || 0) - Number(line.quantity || 0));
      return { ...p, stock, updatedAt: nowIso() };
    });
    await writeJsonFile(PRODUCTS_FILE, next);
    return next;
  });
}

export function normalizeCategory(raw: string): ProductCategory {
  const v = raw.toLowerCase();
  if (v === "fitness" || v === "kids" || v === "senior" || v === "peanut") return v;
  // Back-compat from older demo values
  if (v === "gym") return "fitness";
  return "fitness";
}


