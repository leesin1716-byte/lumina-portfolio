"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Drift amount as a fraction of viewport; positive moves up on scroll. */
  speed?: number;
};

/** Subtle scroll-linked vertical drift. Disabled under reduced motion. */
export function Parallax({ children, className, speed = 0.12 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [speed * 120, speed * -120],
  );

  return (
    <motion.div ref={ref} style={{ y: reduced ? 0 : y }} className={className}>
      {children}
    </motion.div>
  );
}
