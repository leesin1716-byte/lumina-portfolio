"use client";

/** Compact 14-day views bar chart (no chart lib — pure CSS heights). */
export function DailyViewsChart({
  data,
}: {
  data: { day: string; count: number }[];
}) {
  const map = new Map(data.map((d) => [d.day, d.count]));
  const today = new Date();
  const days: { label: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ label: `${d.getMonth() + 1}/${d.getDate()}`, count: map.get(key) ?? 0 });
  }
  const max = Math.max(1, ...days.map((d) => d.count));
  const total = days.reduce((a, b) => a + b.count, 0);

  return (
    <div>
      <div className="flex h-24 items-end gap-1">
        {days.map((d, i) => (
          <div
            key={i}
            className="group flex h-full flex-1 items-end"
            title={`${d.label} · ${d.count}회`}
          >
            <div
              className="w-full rounded-sm bg-gradient-to-t from-violet to-cyan opacity-80 transition-opacity group-hover:opacity-100"
              style={{
                height: d.count ? `${Math.max((d.count / max) * 100, 6)}%` : "2px",
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[10px] text-faint">
        <span>{days[0].label}</span>
        <span>최근 14일 · 합계 {total.toLocaleString()}회</span>
        <span>{days[days.length - 1].label}</span>
      </div>
    </div>
  );
}
