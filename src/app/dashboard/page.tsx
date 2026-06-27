import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { DashboardEditor } from "@/components/dashboard/DashboardEditor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "대시보드",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center px-6 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            설정이 필요해요
          </h1>
          <p className="mt-3 text-pretty text-muted">
            Supabase 환경변수가 아직 설정되지 않았습니다. 프로젝트 루트의
            <code className="mx-1 rounded bg-surface px-1.5 py-0.5 text-sm">
              .env.local
            </code>
            에 키를 넣고 서버를 재시작해주세요.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-fg px-5 py-3 text-sm font-semibold text-bg"
          >
            홈으로
          </Link>
        </div>
      </main>
    );
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();

  // Inbox — graceful empty if the messages table isn't migrated yet.
  const { data: messages } = await supabase
    .from("messages")
    .select("id, name, email, message, created_at")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  // Last 14 days of daily views — graceful empty if daily-views.sql isn't run.
  const since = new Date(Date.now() - 13 * 86400000).toISOString().slice(0, 10);
  const { data: daily } = await supabase
    .from("portfolio_daily_views")
    .select("day, count")
    .eq("owner_id", user.id)
    .gte("day", since)
    .order("day", { ascending: true });

  // Top traffic sources — graceful empty if referrers.sql isn't run.
  const { data: referrers } = await supabase
    .from("portfolio_referrers")
    .select("source, count")
    .eq("owner_id", user.id)
    .order("count", { ascending: false })
    .limit(8);

  return (
    <DashboardEditor
      email={user.email ?? ""}
      plan={profile?.plan ?? "free"}
      portfolio={portfolio}
      views={(portfolio as { views?: number } | null)?.views ?? 0}
      messages={messages ?? []}
      dailyViews={daily ?? []}
      referrers={referrers ?? []}
    />
  );
}
