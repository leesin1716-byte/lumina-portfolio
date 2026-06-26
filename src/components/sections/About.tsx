"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { about } from "@/lib/content";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const ringY = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section
      ref={ref}
      id="about"
      className="relative isolate mx-auto max-w-7xl scroll-mt-24 px-6 py-24 sm:px-8 sm:py-32"
    >
      {/* Scroll-parallax decorative accents */}
      <motion.div
        aria-hidden
        style={{ y: orbY }}
        className="pointer-events-none absolute right-[6%] top-[18%] z-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(109,92,255,0.22),transparent_65%)] blur-2xl sm:h-96 sm:w-96"
      />
      <motion.div
        aria-hidden
        style={{ y: ringY }}
        className="pointer-events-none absolute bottom-[10%] left-[2%] z-0 hidden h-64 w-64 animate-spin-slow rounded-full border border-line-strong [mask-image:linear-gradient(transparent,#000)] md:block"
      />

      <div className="relative z-10 mb-14 flex items-center gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-violet">
          {about.overline}
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="relative z-10 grid gap-14 md:grid-cols-[1.4fr_1fr]">
        <AnimatedText
          as="h2"
          text={about.heading}
          className="font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl"
        />

        <div className="flex flex-col gap-6">
          {about.body.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
        {about.stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative bg-bg-soft p-7 transition-colors hover:bg-surface sm:p-9"
          >
            <CountUp
              value={s.value}
              className="block font-display text-4xl font-bold text-gradient sm:text-5xl"
            />
            <div className="mt-2 text-sm text-muted">{s.label}</div>
            <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-violet to-cyan transition-all duration-500 group-hover:w-full" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
