"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useIsTouch } from "@/lib/hooks";

/**
 * A subtle ring that trails the cursor as ambiance. The native system cursor
 * stays fully visible and functional — this is purely additive.
 */
export function CustomCursor() {
  const isTouch = useIsTouch();
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 400, damping: 30, mass: 0.4 });
  const ry = useSpring(y, { stiffness: 400, damping: 30, mass: 0.4 });

  useEffect(() => {
    if (isTouch) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(
        "a, button, [data-cursor], [role='button'], input, textarea, select",
      );
      setHovering(!!el);
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, [isTouch, visible, x, y]);

  if (isTouch) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: rx, y: ry }}
      className="pointer-events-none fixed left-0 top-0 z-[120] hidden md:block"
    >
      <motion.div
        className="rounded-full border border-white/70 mix-blend-difference"
        style={{ translate: "-50% -50%" }}
        animate={{
          width: hovering ? 48 : 26,
          height: hovering ? 48 : 26,
          opacity: visible ? 1 : 0,
          backgroundColor: hovering
            ? "rgba(255,255,255,0.14)"
            : "rgba(255,255,255,0)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      />
    </motion.div>
  );
}
