"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const testimonials = [
  {
    name: "Aditi R.",
    role: "Fitness enthusiast",
    text: "Gym Power Millet Mix tastes clean and keeps my energy steady. No heaviness, just smooth recovery."
  },
  {
    name: "Karthik S.",
    role: "Parent",
    text: "My kid loves the Kids Growth mix in warm milk. Finally a nutrition drink without weird additives."
  },
  {
    name: "Meera V.",
    role: "Senior wellness",
    text: "Senior Health mix is gentle and comforting. My digestion feels better and I feel more active."
  }
];

export function TestimonialsSlider() {
  const slides = useMemo(() => testimonials, []);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setIdx((x) => (x + 1) % slides.length), 4500);
    return () => window.clearInterval(t);
  }, [slides.length]);

  const item = slides[idx];

  return (
    <div className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur">
      <div className="flex items-center gap-2 text-sm font-extrabold text-brand-green">
        <Quote className="h-5 w-5" />
        Customers love us
      </div>
      <div className="mt-4 min-h-[120px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <p className="text-base text-neutral-800">“{item.text}”</p>
            <div className="mt-3 text-sm font-semibold text-neutral-700">
              {item.name} <span className="text-neutral-500">· {item.role}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-4 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={i === idx ? "h-2 w-8 rounded-full bg-brand-orange" : "h-2 w-2 rounded-full bg-neutral-300"}
            aria-label={`Go to testimonial ${i + 1}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  );
}


