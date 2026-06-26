"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AuroraBackdrop } from "@/components/sections/AuroraBackdrop";

/** App-level error boundary — a graceful, on-brand recovery screen. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for diagnostics (no PII).
    console.error(error);
  }, [error]);

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <AuroraBackdrop />
      <div className="relative z-10 flex flex-col items-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-magenta">
          Error
        </p>
        <h1 className="font-display text-5xl font-bold tracking-tight text-gradient-shimmer sm:text-7xl">
          잠시 빛이 흐트러졌어요
        </h1>
        <p className="mt-6 max-w-sm text-pretty text-muted">
          예상치 못한 문제가 발생했습니다. 다시 시도하면 대부분 해결돼요.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            data-cursor="hover"
            className="rounded-full bg-fg px-7 py-4 text-sm font-medium text-bg transition-colors hover:bg-violet"
          >
            다시 시도
          </button>
          <Link
            href="/"
            data-cursor="hover"
            className="rounded-full border border-line-strong px-7 py-4 text-sm font-medium transition-colors hover:border-violet"
          >
            홈으로
          </Link>
        </div>
      </div>
    </section>
  );
}
