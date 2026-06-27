"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(true);

  useEffect(() => {
    const signalReady = () => {
      window.__luminaReady = true;
      window.dispatchEvent(new Event("lumina:ready"));
    };

    // Show once per browser session.
    if (sessionStorage.getItem("lumina:preloaded")) {
      signalReady();
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setDone(false);
    document.body.style.overflow = "hidden";

    const dur = reduced ? 400 : 2100;
    const start = performance.now();
    let raf = 0;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      // ease-out so the number decelerates near 100
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          sessionStorage.setItem("lumina:preloaded", "1");
          document.body.style.overflow = "";
          setDone(true);
          signalReady();
        }, 260);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg"
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: EASE }}
        >
          {/* Aurora glow behind wordmark */}
          <motion.div
            aria-hidden
            className="absolute h-[40vmax] w-[40vmax] rounded-full blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, rgba(109,92,255,0.5), rgba(255,95,162,0.25) 50%, transparent 70%)",
            }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
          />

          <div className="relative overflow-hidden">
            <motion.h1
              className="font-display text-5xl font-bold tracking-tight text-fg sm:text-7xl"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            >
              {site.name}
            </motion.h1>
          </div>

          <div className="relative mt-6 h-px w-[min(60vw,360px)] overflow-hidden bg-line">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-iris via-cyan to-magenta"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="absolute bottom-8 right-8 font-mono text-sm text-muted tabular-nums">
            {String(progress).padStart(3, "0")}
            <span className="text-faint">%</span>
          </div>
          <div className="absolute bottom-8 left-8 font-mono text-xs uppercase tracking-widest text-faint">
            경험을 불러오는 중
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
