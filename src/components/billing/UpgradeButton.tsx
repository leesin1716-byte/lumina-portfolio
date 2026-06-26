"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? "";

export function UpgradeButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const onClick = async () => {
    if (!clientKey) {
      setNote("결제 기능은 곧 오픈됩니다 (토스페이먼츠 연동 준비 중).");
      return;
    }
    if (!isSupabaseConfigured) {
      router.push("/signup?plan=pro");
      return;
    }
    setLoading(true);
    setNote(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/pricing");
        return;
      }
      const toss = await loadTossPayments(clientKey);
      await toss.requestBillingAuth("카드", {
        customerKey: user.id,
        successUrl: `${window.location.origin}/billing/success`,
        failUrl: `${window.location.origin}/billing/fail`,
      });
    } catch (e) {
      setNote(e instanceof Error ? e.message : "결제 요청에 실패했어요.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-stretch gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        data-cursor="hover"
        className={className}
      >
        {loading ? "처리 중…" : children}
      </button>
      {note && <p className="text-center text-xs text-muted">{note}</p>}
    </div>
  );
}
