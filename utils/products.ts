import type { Product, ProductCategory } from "@/utils/types";
import { listProducts, getProductBySlug as dbGetBySlug } from "@/lib/db/productsDb";

export async function getAllProducts(): Promise<Product[]> {
  return listProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return dbGetBySlug(slug);
}

export async function getProductsByCategory(category?: ProductCategory): Promise<Product[]> {
  const all = await getAllProducts();
  if (!category) return all;
  return all.filter((p) => p.category === category);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getAllProducts();
  const others = all.filter((p) => p.slug !== product.slug);
  const same = others.filter((p) => p.category === product.category);
  const rest = others.filter((p) => p.category !== product.category);
  return [...same, ...rest].slice(0, limit);
}


