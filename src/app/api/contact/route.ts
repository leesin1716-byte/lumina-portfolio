import { NextResponse } from "next/server";
import { isAdminConfigured } from "@/lib/supabase/admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort in-memory rate limit (per warm instance): max 5 messages / 10 min
// per IP. Not a hard guarantee across serverless instances, but it blunts bursts.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // crude memory guard
  return recent.length > MAX_PER_WINDOW;
}

/** Stores a visitor's message to a portfolio owner (service-role insert). */
export async function POST(req: Request) {
  if (!isAdminConfigured) return NextResponse.json({ ok: false });

  const body = (await req.json().catch(() => null)) as {
    slug?: string;
    name?: string;
    email?: string;
    message?: string;
    company?: string; // honeypot — humans never see or fill this
  } | null;

  // Honeypot: a filled hidden field means a bot. Pretend success so it can't
  // probe for the real validation, but never store anything.
  if ((body?.company ?? "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const slug = (body?.slug ?? "").trim();
  const name = (body?.name ?? "").trim().slice(0, 120);
  const email = (body?.email ?? "").trim().slice(0, 200);
  const message = (body?.message ?? "").trim();
  if (!slug || message.length < 2) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();

  // Resolve the owner so they can read it in their dashboard inbox later.
  const { data: row } = await supabase
    .from("portfolios")
    .select("user_id")
    .eq("slug", slug)
    .maybeSingle();

  const { error } = await supabase.from("messages").insert({
    owner_id: row?.user_id ?? null,
    portfolio_slug: slug,
    name: name || null,
    email: email || null,
    message: message.slice(0, 4000),
  });
  if (error) return NextResponse.json({ ok: false }, { status: 500 });

  return NextResponse.json({ ok: true });
}
