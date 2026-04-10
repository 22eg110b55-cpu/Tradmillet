"use client";

import { motion, type Variants } from "framer-motion";
import type { PropsWithChildren } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 }
};

export function MotionSection({
  children,
  className
}: PropsWithChildren<{
  className?: string;
}>) {
  return (
    <motion.section
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}


