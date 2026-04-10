import type { MetadataRoute } from "next";
import { getAllProducts } from "@/utils/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://tradmilletfoods.example";
  const products = await getAllProducts();
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/products`, lastModified: now },
    ...products.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: now })),
    { url: `${base}/recipes`, lastModified: now },
    { url: `${base}/quiz`, lastModified: now },
    { url: `${base}/blog`, lastModified: now },
    { url: `${base}/about`, lastModified: now },
    { url: `${base}/contact`, lastModified: now }
  ];
}


