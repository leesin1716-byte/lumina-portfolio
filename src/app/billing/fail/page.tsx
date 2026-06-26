import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "결제 실패",
  robots: { index: false, follow: false },
};

export default async function BillingFail({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; code?: string }>;
}) {
  const { message } = await searchParams;
  return (
    <main className="flex min-h-[100svh] items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-magenta/15 text-2xl text-magenta">
          !
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          결제가 취소되었어요
        </h1>
        <p className="mt-3 text-pretty text-muted">
          {message ?? "결제를 다시 시도하거나, 다른 카드로 진행해 주세요."}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/pricing"
            className="rounded-full bg-fg px-6 py-3 text-sm font-semibold text-bg"
          >
            다시 시도
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-line-strong px-6 py-3 text-sm"
          >
            대시보드로
          </Link>
        </div>
      </div>
    </main>
  );
}
