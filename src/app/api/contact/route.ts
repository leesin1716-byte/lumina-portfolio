import { NextResponse } from "next/server";
import { isAdminConfigured } from "@/lib/supabase/admin";

/** Stores a visitor's message to a portfolio owner (service-role insert). */
export async function POST(req: Request) {
  if (!isAdminConfigured) return NextResponse.json({ ok: false });

  const body = (await req.json().catch(() => null)) as {
    slug?: string;
    name?: string;
    email?: string;
    message?: string;
  } | null;

  const slug = (body?.slug ?? "").trim();
  const name = (body?.name ?? "").trim();
  const email = (body?.email ?? "").trim();
  const message = (body?.message ?? "").trim();
  if (!slug || !message) {
    return NextResponse.json({ ok: false }, { status: 400 });
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
