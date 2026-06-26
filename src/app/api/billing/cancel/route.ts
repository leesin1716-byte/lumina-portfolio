import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/** Cancels the caller's Pro subscription (sets plan back to free). */
export async function POST() {
  if (!isSupabaseConfigured) return NextResponse.json({ ok: false });
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const { error } = await supabase
    .from("profiles")
    .update({ plan: "free" })
    .eq("id", user.id);
  if (error) return NextResponse.json({ ok: false }, { status: 500 });

  // Best-effort: clear the stored billing key (needs billing.sql columns).
  await supabase
    .from("profiles")
    .update({ billing_key: null, subscription_status: "canceled" })
    .eq("id", user.id);

  return NextResponse.json({ ok: true });
}
