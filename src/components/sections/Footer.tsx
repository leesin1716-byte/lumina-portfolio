"use client";

import { site, socials } from "@/lib/content";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";

export function Footer() {
  const { scrollTo } = useSmoothScroll();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-soft">
      {/* Giant marquee name */}
      <div
        aria-hidden
        className="mask-x-fade flex select-none overflow-hidden py-10"
      >
        <div className="flex shrink-0 animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <span
              key={i}
              className="px-8 font-display text-[14vw] font-bold leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.12)]"
            >
              {site.role} —
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-10 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="group flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
              >
                <span className="h-1 w-1 rounded-full bg-violet transition-transform group-hover:scale-150" />
                {s.label}
              </a>
            ))}
          </div>
          <button
            onClick={() => scrollTo("#home", -10)}
            data-cursor="hover"
            className="group flex items-center gap-2 self-start text-sm text-muted transition-colors hover:text-fg sm:self-end"
          >
            Back to top
            <span className="transition-transform group-hover:-translate-y-1">
              ↑
            </span>
          </button>
        </div>

        <div className="flex flex-col gap-2 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.owner}. Crafted with light & code.
          </p>
          <p className="font-mono uppercase tracking-widest">
            {site.location} · Available for work
          </p>
        </div>
      </div>
    </footer>
  );
}
