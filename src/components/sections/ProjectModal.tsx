"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/content";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  project: Project | null;
  onClose: () => void;
};

/** Immersive case-study overlay for a selected project. */
export function ProjectModal({ project, onClose }: Props) {
  const { lenis } = useSmoothScroll();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [project, lenis, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            aria-label="Close project"
            onClick={onClose}
            data-cursor="hover"
            className="absolute inset-0 bg-bg/80 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} case study`}
            className="relative z-10 flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-line-strong bg-bg-soft shadow-2xl shadow-black/60"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* Banner */}
            <div
              className="relative h-44 shrink-0 overflow-hidden sm:h-56"
              style={{
                background: `linear-gradient(120deg, ${project.gradient[0]}, ${project.gradient[1]})`,
              }}
            >
              <div className="absolute inset-0 opacity-30 mix-blend-overlay [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.85),transparent_55%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-soft via-transparent to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/80">
                    {project.category}
                  </p>
                  <h3 className="mt-1 font-display text-4xl font-bold text-white sm:text-5xl">
                    {project.title}
                  </h3>
                </div>
                <span className="font-mono text-sm text-white/80">
                  {project.year}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <div className="grid gap-8 sm:grid-cols-[1.6fr_1fr]">
                <div>
                  <h4 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-violet">
                    Overview
                  </h4>
                  <p className="text-pretty leading-relaxed text-muted">
                    {project.overview}
                  </p>

                  <h4 className="mb-3 mt-8 font-mono text-xs uppercase tracking-[0.2em] text-violet">
                    Highlights
                  </h4>
                  <ul className="flex flex-col gap-2.5">
                    {project.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-3 text-sm text-muted"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gradient-to-r from-violet to-cyan" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <h4 className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-faint">
                      Role
                    </h4>
                    <p className="text-sm text-fg">{project.role}</p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-faint">
                      Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-line px-2.5 py-1 text-xs text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={project.href ?? "#"}
                    data-cursor="hover"
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-fg px-5 py-3 text-sm font-medium text-bg transition-colors hover:bg-violet"
                  >
                    Visit project
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            </div>

            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              data-cursor="hover"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-bg/50 text-fg backdrop-blur transition-colors hover:bg-bg"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
