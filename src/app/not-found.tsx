import Link from "next/link";
import { AuroraBackdrop } from "@/components/sections/AuroraBackdrop";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <AuroraBackdrop />
      <div className="relative z-10 flex flex-col items-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-violet">
          Error 404
        </p>
        <h1 className="font-display text-7xl font-bold tracking-tight text-gradient-shimmer sm:text-9xl">
          404
        </h1>
        <p className="mt-6 max-w-sm text-pretty text-muted">
          이 페이지는 궤도를 벗어났습니다. 익숙한 빛으로 다시 모셔다 드릴게요.
        </p>
        <Link
          href="/"
          data-cursor="hover"
          className="mt-10 rounded-full bg-fg px-7 py-4 text-sm font-medium text-bg transition-colors hover:bg-violet"
        >
          홈으로
        </Link>
      </div>
    </section>
  );
}
