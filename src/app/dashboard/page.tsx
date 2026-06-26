import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { DashboardEditor } from "@/components/dashboard/DashboardEditor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "대시보드" };

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
    .select("id, slug, data, published")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <DashboardEditor
      email={user.email ?? ""}
      plan={profile?.plan ?? "free"}
      portfolio={portfolio}
    />
  );
}
