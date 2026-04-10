import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact TradMillet Foods for support, bulk orders, and partnerships."
};

export default function ContactPage() {
  return (
    <div className="container-prose py-10">
      <h1 className="text-3xl font-black tracking-tight text-neutral-900">Contact</h1>
      <p className="mt-2 text-sm text-neutral-700">We’ll reply within 1–2 business days.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <ContactForm />

        <div className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur">
          <div className="text-lg font-extrabold text-neutral-900">Reach us</div>
          <div className="mt-4 grid gap-2 text-sm text-neutral-700">
            <div>Email: support@tradmilletfoods.com</div>
            <div>Phone: +91 7893256535</div>
            <div>WhatsApp: +91 7893256535</div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-black/10">
            <div className="flex items-center gap-2 text-sm font-extrabold text-neutral-900">
              <MapPin className="h-5 w-5 text-brand-green" /> Google Maps
            </div>
            <div className="mt-2 text-xs text-neutral-600">Map placeholder (add your real location embed later).</div>
            <div className="mt-3 aspect-[4/3] rounded-xl bg-[linear-gradient(135deg,rgba(46,125,50,0.12),rgba(245,124,0,0.10))]" />
          </div>

          <Link
            href="https://wa.me/919000000000"
            className="btn btn-secondary mt-6 w-full"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp Us
          </Link>
        </div>
      </div>
    </div>
  );
}


