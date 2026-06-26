"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";

/** Floating control that appears after scrolling and jumps back to the top. */
export function BackToTop() {
  const { scrollTo } = useSmoothScroll();
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setShow(y > (typeof window !== "undefined" ? window.innerHeight : 900));
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          onClick={() => scrollTo("#home", -10)}
          data-cursor="hover"
          aria-label="맨 위로 이동"
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="glass fixed bottom-6 right-6 z-[75] grid h-12 w-12 place-items-center rounded-full text-fg shadow-lg shadow-black/40 transition-colors hover:border-violet hover:text-violet"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
