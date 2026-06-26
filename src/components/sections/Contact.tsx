"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useContent } from "@/components/providers/ContentProvider";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CopyEmail } from "@/components/ui/CopyEmail";

export function Contact() {
  const { contact, site } = useContent();
  const gx = useSpring(0.5, { stiffness: 50, damping: 20 });
  const gy = useSpring(0.5, { stiffness: 50, damping: 20 });
  const left = useTransform(gx, (v) => `${v * 100}%`);
  const top = useTransform(gy, (v) => `${v * 100}%`);

  const onMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    gx.set((e.clientX - r.left) / r.width);
    gy.set((e.clientY - r.top) / r.height);
  };

  return (
    <section
      id="contact"
      onPointerMove={onMove}
      className="relative scroll-mt-24 overflow-hidden px-6 py-24 sm:px-8 sm:py-32"
    >
      {/* Cursor-reactive glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -z-0 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[120px]"
        style={{
          left,
          top,
          background:
            "radial-gradient(circle, rgba(109,92,255,0.25), rgba(255,95,162,0.12) 50%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <span className="mb-8 font-mono text-xs uppercase tracking-[0.25em] text-violet">
          {contact.overline}
        </span>

        <AnimatedText
          as="h2"
          text={contact.heading}
          stagger={0.06}
          className="font-display text-5xl font-bold leading-[1.08] sm:text-7xl md:text-8xl"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-md text-pretty text-base leading-relaxed text-muted sm:text-lg"
        >
          {contact.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12"
        >
          <MagneticButton
            href={`mailto:${site.email}`}
            strength={0.5}
            className="btn-sheen group items-center gap-3 rounded-full bg-fg px-9 py-5 text-base font-semibold text-bg"
          >
            <span>{contact.cta}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </MagneticButton>
        </motion.div>

        <div className="mt-8">
          <CopyEmail
            email={site.email}
            className="font-mono text-sm text-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
          />
        </div>
      </div>
    </section>
  );
}
