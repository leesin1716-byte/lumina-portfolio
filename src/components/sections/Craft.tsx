"use client";

import { motion } from "framer-motion";
import { craft } from "@/lib/content";
import { AnimatedText } from "@/components/ui/AnimatedText";

const marqueeWords = [
  "WebGL",
  "Shaders",
  "Motion",
  "React",
  "Three.js",
  "TypeScript",
  "Interaction",
  "Performance",
  "Design Systems",
  "Accessibility",
];

export function Craft() {
  return (
    <section
      id="craft"
      className="relative scroll-mt-24 overflow-hidden py-28 sm:py-40"
    >
      {/* Tech marquee */}
      <div className="mask-x-fade flex select-none overflow-hidden border-y border-line py-6">
        <div className="flex shrink-0 animate-marquee-rev whitespace-nowrap">
          {[...marqueeWords, ...marqueeWords].map((w, i) => (
            <span
              key={i}
              className="mx-6 flex items-center gap-6 font-display text-2xl font-medium text-muted sm:text-3xl"
            >
              {w}
              <span className="text-violet">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-20 sm:px-8">
        <div className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-violet">
                {craft.overline}
              </span>
            </div>
            <AnimatedText
              as="h2"
              text={craft.heading}
              className="font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {craft.groups.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.7,
                delay: gi * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative overflow-hidden rounded-2xl border border-line bg-bg-soft p-6 transition-colors hover:border-line-strong"
            >
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-violet/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 sm:opacity-0" />
              <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-faint">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-fg"
                  >
                    <span className="h-1 w-1 rounded-full bg-violet" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
