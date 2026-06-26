/** Branded skeleton shown while the dashboard's server data loads. */
export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10" aria-busy="true" aria-live="polite">
      <span className="sr-only">대시보드를 불러오는 중…</span>

      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="h-7 w-7 animate-pulse rounded-full bg-gradient-to-br from-iris via-violet to-magenta opacity-60" />
          <span className="h-5 w-24 animate-pulse rounded bg-surface" />
        </div>
        <div className="flex items-center gap-3">
          <span className="h-8 w-16 animate-pulse rounded-full bg-surface" />
          <span className="h-8 w-8 animate-pulse rounded-full bg-surface" />
        </div>
      </div>

      {/* Card skeletons */}
      {[0, 1, 2].map((i) => (
        <div key={i} className="glass mb-6 rounded-2xl p-6">
          <div className="h-5 w-40 animate-pulse rounded bg-surface" />
          <div className="mt-4 h-3 w-3/4 animate-pulse rounded bg-surface/70" />
          <div className="mt-6 grid gap-3">
            <span className="h-11 w-full animate-pulse rounded-xl bg-surface/60" />
            <span className="h-11 w-full animate-pulse rounded-xl bg-surface/60" />
          </div>
        </div>
      ))}
    </div>
  );
}
