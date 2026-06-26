import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mergeContent, type PortfolioData } from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { PortfolioView } from "@/components/portfolio/PortfolioView";

export const dynamic = "force-dynamic";

async function getPortfolio(slug: string): Promise<PortfolioData | null> {
  if (!isSupabaseConfigured) return null; // demo with defaults pre-setup
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolios")
    .select("data, published")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) notFound();
  return (data.data ?? {}) as PortfolioData;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPortfolio(slug);
  const content = mergeContent(data);
  return {
    title: `${content.site.owner} — ${content.site.role}`,
    description: content.site.tagline,
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPortfolio(slug);
  return <PortfolioView content={mergeContent(data)} />;
}
