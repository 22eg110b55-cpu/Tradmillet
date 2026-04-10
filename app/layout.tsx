import type { Metadata } from "next";
import "@/styles/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartContext";

export const metadata: Metadata = {
  title: {
    default: "TradMillet Foods | Traditional Nutrition. Modern Health.",
    template: "%s | TradMillet Foods"
  },
  description:
    "Premium healthy millet and peanut powders inspired by traditional village recipes. 100% natural ingredients, no chemicals or preservatives.",
  metadataBase: new URL("https://tradmilletfoods.example"),
  openGraph: {
    title: "TradMillet Foods",
    description: "Traditional Nutrition. Modern Health.",
    type: "website"
  },
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}


