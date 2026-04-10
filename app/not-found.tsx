import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-prose py-16">
      <div className="rounded-2xl bg-white/70 p-10 text-center ring-1 ring-black/5 backdrop-blur">
        <div className="text-2xl font-black tracking-tight text-neutral-900">Page not found</div>
        <p className="mt-2 text-sm text-neutral-700">The page you’re looking for doesn’t exist.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Home
          </Link>
          <Link href="/products" className="btn btn-secondary">
            Products
          </Link>
        </div>
      </div>
    </div>
  );
}


