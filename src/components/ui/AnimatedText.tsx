"use client";

import { motion, type Variants } from "framer-motion";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type AnimatedTextProps = {
  text: string;
  className?: string;
  /** Per-word stagger in seconds. */
  stagger?: number;
  delay?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

/**
 * Splits text into words and reveals them with a masked upward slide.
 * Newlines (\n) become hard line breaks.
 */
export function AnimatedText({
  text,
  className,
  stagger = 0.045,
  delay = 0,
  once = true,
  as = "span",
}: AnimatedTextProps) {
  const lines = text.split("\n");
  const Tag = motion[as] as ElementType;

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const word: Variants = {
    hidden: { y: "110%" },
    visible: { y: 0, transition: { duration: 0.8, ease: EASE } },
  };

  return (
    <Tag
      className={cn("inline-block", className)}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.5 }}
      aria-label={text.replace(/\n/g, " ")}
    >
      {lines.map((line, li) => {
        const words = line.split(" ");
        return (
          <span key={li} className="block">
            {words.map((w, wi) => (
              <span
                key={wi}
                aria-hidden
                className="relative -mb-[0.12em] inline-flex overflow-hidden pb-[0.12em] align-bottom leading-[1.15]"
              >
                <motion.span variants={word} className="inline-block">
                  {w}
                </motion.span>
                {wi < words.length - 1 && (
                  <span className="inline-block">&nbsp;</span>
                )}
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
