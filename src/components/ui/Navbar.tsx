"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { useContent } from "@/components/providers/ContentProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Navbar({ portfolio = false }: { portfolio?: boolean }) {
  const { nav, site, socials } = useContent();
  const { scrollTo } = useSmoothScroll();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [prev, setPrev] = useState(0);
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
    if (!open) setHidden(y > prev && y > 320);
    setPrev(y);
  });

  const go = (href: string) => {
    setOpen(false);
    if (typeof document !== "undefined" && document.querySelector(href)) {
      scrollTo(href, -10);
    } else {
      // Section isn't on this page (e.g. /pricing) → go to the landing anchor.
      window.location.href = `/${href}`;
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed inset-x-0 top-0 z-[80] px-5 pt-4 sm:px-8"
      >
        <nav
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500",
            scrolled
              ? "glass shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
              : "border border-transparent",
          )}
        >
          <button
            onClick={() => go("#home")}
            data-cursor="hover"
            className="group flex items-center gap-2.5 rounded-full border border-line bg-surface/40 py-1.5 pl-1.5 pr-4 transition-colors hover:border-line-strong"
            aria-label={`${site.name} — 홈`}
          >
            <span className="relative grid h-7 w-7 place-items-center">
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-iris via-violet to-magenta opacity-90 transition-transform duration-500 group-hover:rotate-180" />
              <span className="relative h-2 w-2 rounded-full bg-bg" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              {site.name}
            </span>
          </button>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const isActive = item.href === `#${activeId}`;
              return (
                <li key={item.href}>
                  <button
                    onClick={() => go(item.href)}
                    data-cursor="hover"
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group relative rounded-full px-4 py-2 text-sm transition-colors hover:text-fg",
                      isActive ? "text-fg" : "text-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "mr-1 font-mono text-[10px] transition-colors",
                        isActive ? "text-violet" : "text-faint",
                      )}
                    >
                      {item.index}
                    </span>
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-4 bottom-1 h-px origin-left bg-gradient-to-r from-violet to-cyan transition-transform duration-300",
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            {!portfolio && (
              <>
                <a
                  href="/pricing"
                  data-cursor="hover"
                  className="rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-fg"
                >
                  요금제
                </a>
                <a
                  href="/login"
                  data-cursor="hover"
                  className="rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-fg"
                >
                  로그인
                </a>
                <MagneticButton
                  href="/signup"
                  className="btn-sheen items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-violet"
                >
                  무료로 시작
                </MagneticButton>
              </>
            )}
          </div>

          {/* Mobile: theme toggle + menu */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setOpen((o) => !o)}
              data-cursor="hover"
              aria-label="메뉴 열기/닫기"
              aria-expanded={open}
              className="relative grid h-9 w-9 place-items-center"
            >
            <span
              className={cn(
                "absolute h-0.5 w-5 bg-fg transition-all duration-300",
                open ? "rotate-45" : "-translate-y-1.5",
              )}
            />
            <span
              className={cn(
                "absolute h-0.5 w-5 bg-fg transition-all duration-300",
                open ? "-rotate-45" : "translate-y-1.5",
              )}
            />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="fixed inset-0 z-[79] flex flex-col bg-bg-soft px-8 pb-12 pt-28 md:hidden"
          >
            <div className="flex flex-1 flex-col justify-center gap-1">
              {nav.map((item, i) => (
                <motion.button
                  key={item.href}
                  onClick={() => go(item.href)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.06, ease: EASE }}
                  className="flex items-baseline gap-4 py-2 text-left"
                >
                  <span className="font-mono text-sm text-faint">
                    {item.index}
                  </span>
                  <span className="font-display text-4xl font-semibold">
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, ease: EASE }}
              className="flex flex-col gap-4 border-t border-line pt-6"
            >
              {!portfolio && (
                <div className="flex gap-3">
                  <a
                    href="/login"
                    className="flex-1 rounded-full border border-line-strong py-3 text-center text-sm font-medium"
                  >
                    로그인
                  </a>
                  <a
                    href="/signup"
                    className="flex-1 rounded-full bg-fg py-3 text-center text-sm font-semibold text-bg"
                  >
                    무료로 시작
                  </a>
                </div>
              )}
              <a
                href={`mailto:${site.email}`}
                className="font-mono text-sm text-muted transition-colors hover:text-fg"
              >
                {site.email}
              </a>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted transition-colors hover:text-fg"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
