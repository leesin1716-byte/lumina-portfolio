"use client";

import { useEffect, useRef, useState } from "react";

/** Tracks the pointer position (viewport coordinates). */
export function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pos;
}

/** True on coarse-pointer / touch devices (no precise hover). */
export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isTouch;
}

/** Respects the user's reduced-motion preference (reactive). */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * True once the intro/preloader has finished (or immediately if it was
 * already shown this session). Lets hero content stage its entrance.
 */
export function useAppReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && window.__luminaReady) {
      setReady(true);
      return;
    }
    const on = () => setReady(true);
    window.addEventListener("lumina:ready", on);
    // Safety net in case the event is missed.
    const t = window.setTimeout(() => setReady(true), 2700);
    return () => {
      window.removeEventListener("lumina:ready", on);
      window.clearTimeout(t);
    };
  }, []);
  return ready;
}

/** Runs a callback once the element enters the viewport. */
export function useInView<T extends HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.2 },
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { ref, inView };
}
