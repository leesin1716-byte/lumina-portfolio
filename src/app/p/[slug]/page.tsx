import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mergeContent, type PortfolioData } from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { PortfolioView } from "@/components/portfolio/PortfolioView";

export const dynamic = "force-dynamic";

type Loaded = { data: PortfolioData | null; branding: boolean };

async function getPortfolio(slug: string): Promise<Loaded> {
  if (!isSupabaseConfigured) return { data: null, branding: true }; // demo pre-setup
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: row } = await supabase
    .from("portfolios")
    .select("data, published, user_id")
    .eq("slug", slug)
    .maybeSingle();
  if (!row) notFound();
  const data = (row.data ?? {}) as PortfolioData;

  // White-label is a Pro perk: only hide the badge for an active Pro owner,
  // enforced here on the server so a free user can't unlock it by editing data.
  let branding = true;
  if (data.hideBadge && row.user_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", row.user_id)
      .maybeSingle();
    if (profile?.plan === "pro") branding = false;
  }
  return { data, branding };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await getPortfolio(slug);
  const content = mergeContent(data);
  const title = `${content.site.owner} — ${content.site.role}`;
  const description = content.site.tagline;
  const url = `/p/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      title,
      description,
      url,
      siteName: "LUMINA",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data, branding } = await getPortfolio(slug);
  return (
    <PortfolioView
      content={mergeContent(data)}
      slug={slug}
      branding={branding}
      accent={data?.accent}
    />
  );
}
