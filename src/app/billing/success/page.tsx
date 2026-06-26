import type { Metadata } from "next";
import Link from "next/link";
import {
  isTossConfigured,
  issueBillingKey,
  chargeBilling,
  PRO_PRICE,
  PRO_ORDER_NAME,
} from "@/lib/toss";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "결제 완료" };

export default async function BillingSuccess({
  searchParams,
}: {
  searchParams: Promise<{ authKey?: string; customerKey?: string }>;
}) {
  const { authKey, customerKey } = await searchParams;
  let ok = false;
  let message = "";

  if (!isTossConfigured || !isSupabaseConfigured) {
    message = "결제 설정이 아직 완료되지 않았습니다.";
  } else if (!authKey || !customerKey) {
    message = "결제 정보가 올바르지 않습니다.";
  } else {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || user.id !== customerKey) {
        throw new Error("로그인 정보가 일치하지 않습니다.");
      }
      const billing = await issueBillingKey(authKey, customerKey);
      await chargeBilling({
        billingKey: billing.billingKey,
        customerKey,
        amount: PRO_PRICE,
        orderId: `pro_${user.id.slice(0, 8)}_${Date.now()}`,
        orderName: PRO_ORDER_NAME,
      });
      await supabase.from("profiles").update({ plan: "pro" }).eq("id", user.id);
      // Best-effort: persist billing key for recurring charges (needs billing.sql).
      await supabase
        .from("profiles")
        .update({ billing_key: billing.billingKey, customer_key: customerKey })
        .eq("id", user.id);
      ok = true;
    } catch (e) {
      message =
        e instanceof Error ? e.message : "결제 처리 중 오류가 발생했습니다.";
    }
  }

  return (
    <main className="flex min-h-[100svh] items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <div
          className={`mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full text-2xl ${
            ok ? "bg-violet/15 text-violet" : "bg-magenta/15 text-magenta"
          }`}
        >
          {ok ? "✓" : "!"}
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {ok ? "Pro로 업그레이드되었어요 🎉" : "결제를 완료하지 못했어요"}
        </h1>
        <p className="mt-3 text-pretty text-muted">
          {ok
            ? "이제 커스텀 도메인, 프리미엄 테마 등 모든 Pro 기능을 사용할 수 있어요."
            : message}
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-block rounded-full bg-fg px-6 py-3 text-sm font-semibold text-bg"
        >
          대시보드로
        </Link>
      </div>
    </main>
  );
}
