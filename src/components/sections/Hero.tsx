"use client";

import { motion, useSpring, type Variants } from "framer-motion";
import { useEffect } from "react";
import { hero, site } from "@/lib/content";
import { useAppReady, useMousePosition } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RotatingText } from "@/components/ui/RotatingText";
import { AuroraBackdrop } from "@/components/sections/AuroraBackdrop";
import { RobotCompanion } from "@/components/canvas/RobotCompanion";

const EASE = [0.16, 1, 0.3, 1] as const;

const lineWrap: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const lineItem: Variants = {
  hidden: { y: "115%" },
  visible: { y: 0, transition: { duration: 1, ease: EASE } },
};
const fade: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export function Hero() {
  const ready = useAppReady();
  const { scrollTo } = useSmoothScroll();
  const mouse = useMousePosition();
  const glowX = useSpring(0, { stiffness: 60, damping: 20 });
  const glowY = useSpring(0, { stiffness: 60, damping: 20 });

  useEffect(() => {
    glowX.set(mouse.x);
    glowY.set(mouse.y);
  }, [mouse.x, mouse.y, glowX, glowY]);

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pb-20 pt-28 sm:px-8">
      <AuroraBackdrop />

      {/* WebGL robot companion (desktop) */}
      <RobotCompanion className="pointer-events-none absolute right-[-3%] top-0 z-[2] hidden h-full w-[52%] lg:block" />

      {/* Cursor-tracking glow */}
      <motion.div
        aria-hidden
        style={{ x: glowX, y: glowY }}
        className="pointer-events-none absolute left-0 top-0 z-[1] hidden h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(109,92,255,0.22),transparent_65%)] blur-2xl md:block"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Overline */}
        <motion.div
          variants={fade}
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
          className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-muted lg:max-w-[58%]"
        >
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
            </span>
            Available for work
          </span>
          <span className="text-faint">/</span>
          <span>{site.location}</span>
          <span className="text-faint">/</span>
          <span>© {new Date().getFullYear()}</span>
        </motion.div>

        {/* Kinetic headline */}
        <motion.h1
          variants={lineWrap}
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
          className="font-display font-bold leading-[1.02] tracking-[-0.01em] lg:max-w-[62%]"
          style={{ fontSize: "clamp(2.5rem, 8vw, 7.5rem)" }}
          aria-label={hero.lines.join(" ")}
        >
          {hero.lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                variants={lineItem}
                className={
                  i === 1
                    ? "inline-block text-gradient-shimmer"
                    : "inline-block"
                }
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Rotating specialty line */}
        <motion.div
          variants={fade}
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
          transition={{ delay: 0.42 }}
          className="mt-7 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] lg:max-w-[58%]"
        >
          <span className="text-faint">Focused on</span>
          <span className="h-px w-8 bg-line-strong" />
          <RotatingText
            items={hero.specialties}
            className="font-medium text-fg"
          />
        </motion.div>

        {/* Intro + CTAs */}
        <div className="mt-10 grid gap-8 sm:mt-12 md:grid-cols-[1.2fr_1fr] md:items-end lg:max-w-[58%]">
          <motion.p
            variants={fade}
            initial="hidden"
            animate={ready ? "visible" : "hidden"}
            transition={{ delay: 0.5 }}
            className="max-w-md text-pretty text-base leading-relaxed text-muted sm:text-lg"
          >
            {hero.intro}
          </motion.p>

          <motion.div
            variants={fade}
            initial="hidden"
            animate={ready ? "visible" : "hidden"}
            transition={{ delay: 0.65 }}
            className="flex flex-wrap items-center gap-4 md:justify-end"
          >
            <MagneticButton
              onClick={() => scrollTo("#work", -10)}
              className="group items-center gap-3 overflow-hidden rounded-full bg-fg px-7 py-4 text-sm font-medium text-bg"
            >
              <span className="relative z-10">작업 보기</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </MagneticButton>
            <MagneticButton
              href={`mailto:${site.email}`}
              className="items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-sm font-medium text-fg transition-colors hover:border-violet"
            >
              연락하기
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate={ready ? "visible" : "hidden"}
        transition={{ delay: 0.9 }}
        className="absolute inset-x-0 bottom-7 z-10 mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
          {hero.scrollCue}
        </span>
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-line-strong p-1.5">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-violet"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
