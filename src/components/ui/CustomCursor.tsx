"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useIsTouch } from "@/lib/hooks";

type Variant = "default" | "hover" | "view";

export function CustomCursor() {
  const isTouch = useIsTouch();
  const [variant, setVariant] = useState<Variant>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });
  const dotX = useSpring(x, { stiffness: 900, damping: 40 });
  const dotY = useSpring(y, { stiffness: 900, damping: 40 });

  useEffect(() => {
    if (isTouch) return;
    document.body.dataset.cursor = "custom";

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(
        "a, button, [data-cursor]",
      ) as HTMLElement | null;
      if (!el) {
        setVariant("default");
        setLabel("");
        return;
      }
      const c = el.dataset.cursor;
      if (c && c !== "custom") {
        setVariant("view");
        setLabel(el.dataset.cursorLabel ?? c);
      } else {
        setVariant("hover");
        setLabel("");
      }
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);
    const downFn = () => setDown(true);
    const upFn = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerdown", downFn);
    document.addEventListener("pointerup", upFn);
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);

    return () => {
      delete document.body.dataset.cursor;
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerdown", downFn);
      document.removeEventListener("pointerup", upFn);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, [isTouch, visible, x, y]);

  if (isTouch) return null;

  const ringSize = variant === "view" ? 76 : variant === "hover" ? 56 : 34;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120]">
      {/* Outer ring */}
      <motion.div
        style={{ x: ringX, y: ringY, translate: "-50% -50%" }}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full"
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? 1 : 0,
          scale: down ? 0.82 : 1,
          backgroundColor:
            variant === "view"
              ? "rgba(139,124,255,0.92)"
              : "rgba(139,124,255,0)",
          borderColor:
            variant === "default"
              ? "rgba(238,240,251,0.6)"
              : "rgba(139,124,255,0.9)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <span className="rounded-full border border-[inherit] absolute inset-0" />
        {label && (
          <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-bg">
            {label}
          </span>
        )}
      </motion.div>

      {/* Inner dot */}
      <motion.div
        style={{ x: dotX, y: dotY, translate: "-50% -50%" }}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-fg"
        animate={{
          opacity: visible && variant !== "view" ? 1 : 0,
          scale: variant === "hover" ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </div>
  );
}
