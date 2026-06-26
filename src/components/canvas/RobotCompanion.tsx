"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppReady, usePrefersReducedMotion } from "@/lib/hooks";

const RobotScene = dynamic(
  () => import("@/components/canvas/RobotScene").then((m) => m.RobotScene),
  { ssr: false, loading: () => null },
);

/**
 * Lazily mounts the WebGL robot after the intro completes so it never blocks
 * first paint. Falls back to the CSS aurora when reduced motion is requested.
 */
export function RobotCompanion({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const ready = useAppReady();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => setMounted(true), 200);
    return () => window.clearTimeout(id);
  }, [ready]);

  if (reduced) return null;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: mounted ? 1 : 0 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {mounted && <RobotScene reducedMotion={reduced} />}
    </motion.div>
  );
}
