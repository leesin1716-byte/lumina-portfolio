import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const base = site.url.replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Add every published portfolio. Anon RLS already exposes only published
  // rows; without keys (or on any error) the static entries above are returned.
  if (isSupabaseConfigured) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { data } = await supabase
        .from("portfolios")
        .select("slug, updated_at")
        .eq("published", true)
        .limit(2000);
      for (const p of (data ?? []) as { slug: string; updated_at: string | null }[]) {
        entries.push({
          url: `${base}/p/${p.slug}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : now,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    } catch {
      /* keep the static entries */
    }
  }

  return entries;
}
