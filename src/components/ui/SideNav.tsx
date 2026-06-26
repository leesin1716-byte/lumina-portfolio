"use client";

import { useEffect, useState } from "react";
import { nav } from "@/lib/content";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/utils";

/** Vertical section-dot navigation pinned to the right edge (desktop only). */
export function SideNav() {
  const { scrollTo } = useSmoothScroll();
  const [active, setActive] = useState("home");

  const go = (href: string) => {
    if (typeof document !== "undefined" && document.querySelector(href)) {
      scrollTo(href, -10);
    } else {
      window.location.href = `/${href}`;
    }
  };

  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <nav
      aria-label="섹션 바로가기"
      className="fixed right-6 top-1/2 z-[70] hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex"
    >
      {nav.map((item) => {
        const isActive = `#${active}` === item.href;
        return (
          <button
            key={item.href}
            onClick={() => go(item.href)}
            data-cursor="hover"
            aria-label={item.label}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-3"
          >
            <span
              className={cn(
                "text-[11px] font-medium transition-all duration-300",
                isActive
                  ? "translate-x-0 text-fg opacity-100"
                  : "-translate-x-2 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
              )}
            >
              {item.label}
            </span>
            <span
              className={cn(
                "h-2 w-2 rounded-full border transition-all duration-300",
                isActive
                  ? "scale-125 border-violet bg-violet"
                  : "border-line-strong bg-transparent group-hover:border-fg",
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
