"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
  ariaLabel?: string;
};

/**
 * Wraps a control so it drifts toward the cursor on hover, then springs back.
 * Renders an <a> when given href, otherwise a <button>.
 */
export function MagneticButton({
  children,
  className,
  href,
  onClick,
  strength = 0.35,
  ariaLabel,
}: MagneticProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const sharedProps = {
    ref: ref as never,
    onMouseMove: handleMove,
    onMouseLeave: reset,
    style: { x: sx, y: sy },
    className: cn("relative inline-flex select-none", className),
    "data-cursor": "hover",
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <motion.a href={href} {...sharedProps}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button type="button" onClick={onClick} {...sharedProps}>
      {children}
    </motion.button>
  );
}
