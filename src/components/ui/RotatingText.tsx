"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type RotatingTextProps = {
  items: readonly string[];
  interval?: number;
  className?: string;
};

/** Cycles through words with a masked vertical slide. Static under reduced motion. */
export function RotatingText({
  items,
  interval = 2200,
  className,
}: RotatingTextProps) {
  const [i, setI] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(
      () => setI((p) => (p + 1) % items.length),
      interval,
    );
    return () => window.clearInterval(id);
  }, [items.length, interval, reduced]);

  if (reduced) {
    return <span className={className}>{items[0]}</span>;
  }

  return (
    <span
      className={cn(
        "relative inline-grid overflow-hidden align-bottom",
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="col-start-1 row-start-1 whitespace-nowrap"
        >
          {items[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
