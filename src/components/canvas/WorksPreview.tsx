"use client";

import { motion, type MotionValue } from "framer-motion";
import type { Project } from "@/lib/content";

type Props = {
  active: number | null;
  projects: Project[];
  px: MotionValue<number>;
  py: MotionValue<number>;
};

/**
 * A crisp cursor-following preview for the Works list: shows the hovered
 * project's cover image (or a clean gradient when none is set), with its title
 * and tags. Replaces the old WebGL noise shader, which read as a muddy smear on
 * software renderers.
 */
export function WorksPreview({ active, projects, px, py }: Props) {
  const p = active !== null ? projects[active] : null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-64 w-80 overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/10 md:block"
      style={{ x: px, y: py, translate: "-50% -50%" }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: active !== null ? 1 : 0,
        scale: active !== null ? 1 : 0.85,
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {p && (
        <>
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(120% 100% at 18% 12%, ${p.gradient[0]}, transparent 60%), linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})`,
              }}
            />
          )}

          {/* Legibility wash */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />

          {/* Title */}
          <div className="absolute inset-x-4 top-4">
            <p className="text-sm font-semibold text-white drop-shadow-sm">
              {p.title}
            </p>
            <p className="mt-0.5 text-xs text-white/75">{p.category}</p>
          </div>

          {/* Tags */}
          <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
            {p.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur"
              >
                {tag}
              </span>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
