"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

type CountUpProps = {
  /** e.g. "40+", "12", "∞" — leading digits animate, suffix is kept. */
  value: string;
  className?: string;
  duration?: number;
};

/** Counts up to the numeric value when scrolled into view. */
export function CountUp({ value, className, duration = 1.6 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = usePrefersReducedMotion();

  const match = value.match(/^(\d+)(.*)$/);
  const [display, setDisplay] = useState(
    match ? `0${match[2] ?? ""}` : value,
  );

  useEffect(() => {
    if (!match) {
      setDisplay(value);
      return;
    }
    const target = parseInt(match[1], 10);
    const suffix = match[2] ?? "";
    if (reduced) {
      setDisplay(value);
      return;
    }
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(`${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, reduced, value, duration, match]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
