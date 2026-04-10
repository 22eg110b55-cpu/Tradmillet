"use client";

import Link from "next/link";
import { LogOut, Package, ShoppingCart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/admin", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="min-h-[70vh] bg-[radial-gradient(circle_at_top,rgba(46,125,50,0.12),transparent_55%)]">
      <div className="container-prose py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="chip bg-brand-green text-white ring-0">Admin</div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-neutral-900">Owner Dashboard</h1>
            <p className="mt-2 text-sm text-neutral-700">Manage products, pricing, and customer orders.</p>
          </div>
          <button
            className="btn btn-secondary md:w-auto"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              router.push("/admin/login");
            }}
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {nav.map((x) => {
            const active = pathname === x.href;
            return (
              <Link key={x.href} href={x.href} className={active ? "chip bg-brand-orange text-white ring-0" : "chip hover:bg-white"}>
                <x.icon className="h-4 w-4" /> {x.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}


