"use client";

import { motion } from "framer-motion";

export type SaveState = { kind: "ok" | "err"; text: string };

/** Small inline toast for the dashboard save bar — distinguishes success vs error. */
export function SaveStatus({ kind, text }: SaveState) {
  const ok = kind === "ok";
  return (
    <motion.span
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
        ok
          ? "border-lime/40 bg-lime/10 text-lime"
          : "border-magenta/40 bg-magenta/10 text-magenta"
      }`}
    >
      <span aria-hidden className="grid h-3.5 w-3.5 place-items-center">
        {ok ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v5M12 17h.01" />
          </svg>
        )}
      </span>
      {text}
    </motion.span>
  );
}
