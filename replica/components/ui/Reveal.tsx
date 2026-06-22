"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUp, fadeIn, staggerParent, viewportOnce } from "@/lib/motion";

type VariantKey = "fadeUp" | "fadeIn" | "stagger";

const variants: Record<VariantKey, Variants> = {
  fadeUp,
  fadeIn,
  stagger: staggerParent,
};

type Props = {
  children: React.ReactNode;
  variant?: VariantKey;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "header" | "footer";
};

export default function Reveal({
  children,
  variant = "fadeUp",
  className,
  delay = 0,
  as = "div",
}: Props) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={variants[variant]}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );
}
