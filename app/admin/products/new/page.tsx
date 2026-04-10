"use client";

import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";

export default function AdminNewProductPage() {
  const router = useRouter();
  return (
    <AdminShell>
      <ProductForm
        onSaved={(p) => {
          router.push(`/admin/products/${p.id}/edit`);
        }}
      />
    </AdminShell>
  );
}


