"use client";

import { useEffect, useRef, useState } from "react";
import { useSpring } from "framer-motion";
import { useIsTouch } from "@/lib/hooks";
import { useContent } from "@/components/providers/ContentProvider";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { Parallax } from "@/components/ui/Parallax";
import { WorksPreview } from "@/components/canvas/WorksPreview";
import { ProjectModal } from "@/components/sections/ProjectModal";

export function Works() {
  const { projects } = useContent();
  const isTouch = useIsTouch();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const px = useSpring(0, { stiffness: 140, damping: 18, mass: 0.5 });
  const py = useSpring(0, { stiffness: 140, damping: 18, mass: 0.5 });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const onMove = (e: React.PointerEvent) => {
    px.set(e.clientX);
    py.set(e.clientY);
    const row = (e.target as HTMLElement).closest<HTMLElement>("[data-index]");
    const idx = row ? Number(row.dataset.index) : null;
    setActive((prev) => (prev === idx ? prev : idx));
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative scroll-mt-24 px-6 py-24 sm:px-8 sm:py-32"
      onPointerMove={onMove}
      onPointerLeave={() => setActive(null)}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-violet">
                선택한 작업
              </span>
            </div>
            <Parallax speed={0.08}>
              <AnimatedText
                as="h2"
                text={"경계를 허무는\n프로젝트."}
                className="font-display text-4xl font-semibold leading-[1.08] sm:text-6xl"
              />
            </Parallax>
          </div>
          <p className="max-w-xs text-sm text-muted sm:text-right">
            몰입형으로 빚어낸 작업들 — 각각이 모션과 깊이, 디테일에 대한 하나의
            실험입니다.
          </p>
        </div>

        {/* Project list */}
        <ul className="border-t border-line">
          {projects.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                data-index={i}
                data-cursor="view"
                data-cursor-label="Open"
                onClick={() => {
                  setSelected(i);
                  setActive(null);
                }}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                aria-label={`${p.title} — view case study`}
                className="group relative flex w-full flex-col gap-3 border-b border-line py-7 text-left transition-colors sm:flex-row sm:items-center sm:justify-between sm:py-9"
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
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Floating shader preview (desktop, only while in view) */}
      {!isTouch && inView && (
        <WorksPreview active={active} projects={projects} px={px} py={py} />
      )}

      <ProjectModal
        project={selected !== null ? projects[selected] : null}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
