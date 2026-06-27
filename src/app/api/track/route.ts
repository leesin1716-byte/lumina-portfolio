import { NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

/**
 * Reduces a raw `document.referrer` URL to a tidy source label:
 * "https://www.google.com/search?q=x" → "google.com", "" → "direct".
 */
function normalizeSource(referrer: unknown): string {
  if (typeof referrer !== "string" || !referrer.trim()) return "direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return host || "direct";
  } catch {
    return "direct";
  }
}

/** Records a portfolio view (fire-and-forget from the public /p page). */
export async function POST(request: Request) {
  if (!isAdminConfigured) return NextResponse.json({ ok: false });
  try {
    const { slug, referrer } = await request.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const supabase = createAdminClient();
    await supabase.rpc("increment_portfolio_views", { p_slug: slug });
    // Best-effort per-day count (no-op until daily-views.sql is migrated).
    await supabase.rpc("increment_daily_view", { p_slug: slug });
    // Best-effort traffic source (no-op until referrers.sql is migrated).
    await supabase.rpc("increment_referrer", {
      p_slug: slug,
      p_source: normalizeSource(referrer),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
