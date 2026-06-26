"use client";

import { useState } from "react";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import { projects } from "@/lib/content";
import { useIsTouch } from "@/lib/hooks";
import { AnimatedText } from "@/components/ui/AnimatedText";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Works() {
  const isTouch = useIsTouch();
  const [active, setActive] = useState<number | null>(null);
  const px = useSpring(0, { stiffness: 150, damping: 20, mass: 0.5 });
  const py = useSpring(0, { stiffness: 150, damping: 20, mass: 0.5 });

  const onMove = (e: React.MouseEvent) => {
    px.set(e.clientX);
    py.set(e.clientY);
  };

  return (
    <section
      id="work"
      className="relative scroll-mt-24 px-6 py-28 sm:px-8 sm:py-40"
      onMouseMove={onMove}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-violet">
                Selected Work
              </span>
            </div>
            <AnimatedText
              as="h2"
              text={"Projects that\nblur the line."}
              className="font-display text-4xl font-semibold leading-[1] tracking-tight sm:text-6xl"
            />
          </div>
          <p className="max-w-xs text-sm text-muted sm:text-right">
            A selection of immersive builds — each one an experiment in motion,
            depth, and detail.
          </p>
        </div>

        {/* Project list */}
        <ul className="border-t border-line">
          {projects.map((p, i) => (
            <li key={p.id}>
              <a
                href={p.href ?? "#"}
                data-cursor="view"
                data-cursor-label="View"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="group relative flex flex-col gap-3 border-b border-line py-7 transition-colors sm:flex-row sm:items-center sm:justify-between sm:py-9"
              >
                {/* hover fill */}
                <span className="pointer-events-none absolute inset-0 -z-0 origin-bottom scale-y-0 bg-surface/40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />

                <div className="relative z-10 flex items-baseline gap-5 sm:gap-8">
                  <span className="font-mono text-sm text-faint transition-colors group-hover:text-violet">
                    0{i + 1}
                  </span>
                  <h3 className="font-display text-3xl font-semibold tracking-tight transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 sm:text-5xl">
                    {p.title}
                  </h3>
                </div>

                <div className="relative z-10 flex items-center gap-6 pl-10 sm:pl-0">
                  <span className="text-sm text-muted">{p.category}</span>
                  <span className="font-mono text-sm text-faint">{p.year}</span>
                  <span className="hidden h-9 w-9 place-items-center rounded-full border border-line-strong text-fg transition-all duration-500 group-hover:border-violet group-hover:bg-violet group-hover:text-bg sm:grid">
                    ↗
                  </span>
                </div>

                {/* Mobile preview strip */}
                <div
                  className="relative z-10 mt-1 h-1 w-full rounded-full sm:hidden"
                  style={{
                    background: `linear-gradient(90deg, ${p.gradient[0]}, ${p.gradient[1]})`,
                  }}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Floating cursor preview (desktop) */}
      {!isTouch && (
        <AnimatePresence>
          {active !== null && (
            <motion.div
              className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-64 w-80 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl md:block"
              style={{ x: px, y: py }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div
                className="relative h-full w-full"
                style={{
                  background: `linear-gradient(135deg, ${projects[active].gradient[0]}, ${projects[active].gradient[1]})`,
                }}
              >
                <div className="absolute inset-0 opacity-30 mix-blend-overlay [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.8),transparent_50%)]" />
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                  {projects[active].tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
}
