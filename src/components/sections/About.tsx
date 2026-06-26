"use client";

import { motion } from "framer-motion";
import { about } from "@/lib/content";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section
      id="about"
      className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-28 sm:px-8 sm:py-40"
    >
      <div className="mb-14 flex items-center gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-violet">
          {about.overline}
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="grid gap-14 md:grid-cols-[1.4fr_1fr]">
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
      <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
        {about.stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative bg-bg-soft p-7 transition-colors hover:bg-surface sm:p-9"
          >
            <div className="font-display text-4xl font-bold text-gradient sm:text-5xl">
              {s.value}
            </div>
            <div className="mt-2 text-sm text-muted">{s.label}</div>
            <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-violet to-cyan transition-all duration-500 group-hover:w-full" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
