"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Content } from "@/lib/content";
import { ContentProvider } from "@/components/providers/ContentProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Navbar } from "@/components/ui/Navbar";
import { SideNav } from "@/components/ui/SideNav";
import { BackToTop } from "@/components/ui/BackToTop";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Works } from "@/components/sections/Works";
import { Craft } from "@/components/sections/Craft";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

/** Renders a user's portfolio with the immersive design, fed by their data. */
export function PortfolioView({
  content,
  slug,
  branding = true,
}: {
  content: Content;
  slug?: string;
  branding?: boolean;
}) {
  useEffect(() => {
    // The hero waits for a "ready" signal (normally from the preloader, which
    // public portfolios don't render). Signal immediately so it appears at once.
    window.__luminaReady = true;
    window.dispatchEvent(new Event("lumina:ready"));
  }, []);

  useEffect(() => {
    if (!slug) return;
    // Fire-and-forget view tracking.
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {});
  }, [slug]);

  return (
    <ContentProvider value={content}>
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-fg focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-bg"
      >
        본문으로 건너뛰기
      </a>
      <SmoothScroll>
        <Navbar portfolio />
        <SideNav />
        <main id="home">
          <Hero />
          <About />
          <Works />
          <Craft />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
      </SmoothScroll>

      {branding && (
        <Link
          href="/"
          data-cursor="hover"
          className="glass fixed bottom-6 left-6 z-[75] flex items-center gap-2 rounded-full px-3.5 py-2 text-xs text-muted transition-colors hover:text-fg"
        >
          <span className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-iris via-violet to-magenta" />
          LUMINA로 제작
        </Link>
      )}
    </ContentProvider>
  );
}
