"use client";

import { useEffect } from "react";
import { site } from "@/lib/content";

/** A friendly styled message for anyone who opens the console. */
export function ConsoleGreeting() {
  useEffect(() => {
    console.log(
      `%c${site.name}`,
      "font:700 38px ui-sans-serif,sans-serif; color:#8b7cff; text-shadow:0 2px 14px rgba(109,92,255,0.5);",
    );
    console.log(
      `%c${site.role}  ·  curious about the build?\nLet's talk → ${site.email}`,
      "font:500 13px ui-monospace,monospace; color:#9aa0b9; line-height:1.7;",
    );
    console.log(
      "%c↳ Next.js · React Three Fiber · GLSL · Framer Motion · Lenis",
      "font:12px ui-monospace,monospace; color:#4de2e2;",
    );
  }, []);

  return null;
}
