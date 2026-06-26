/** Minimal branded loader while a public portfolio's data is fetched. */
export default function PortfolioLoading() {
  return (
    <div
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-bg"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">포트폴리오를 불러오는 중…</span>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(109,92,255,0.16),transparent_60%)] blur-3xl"
      />
      <div className="relative flex flex-col items-center gap-5">
        <span className="relative grid h-14 w-14 place-items-center">
          <span className="absolute inset-0 animate-spin-slow rounded-full border border-line-strong [mask-image:linear-gradient(transparent,#000)]" />
          <span className="h-7 w-7 animate-pulse rounded-full bg-gradient-to-br from-iris via-violet to-magenta" />
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          Loading
        </span>
      </div>
    </div>
  );
}
