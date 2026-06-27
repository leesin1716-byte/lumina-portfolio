import { NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

/** Records a portfolio view (fire-and-forget from the public /p page). */
export async function POST(request: Request) {
  if (!isAdminConfigured) return NextResponse.json({ ok: false });
  try {
    const { slug } = await request.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const supabase = createAdminClient();
    await supabase.rpc("increment_portfolio_views", { p_slug: slug });
    // Best-effort per-day count (no-op until daily-views.sql is migrated).
    await supabase.rpc("increment_daily_view", { p_slug: slug });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
