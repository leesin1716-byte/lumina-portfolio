import { ImageResponse } from "next/og";
import {
  mergeContent,
  portfolioThemes,
  type PortfolioData,
  type PortfolioThemeKey,
} from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { loadKoreanFont } from "@/lib/og-font";

// Node runtime so we can read the portfolio (Supabase) and large font bytes.
export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "포트폴리오 — LUMINA";

async function load(
  slug: string,
): Promise<{ data: PortfolioData | null; accent: PortfolioThemeKey }> {
  if (!isSupabaseConfigured) return { data: null, accent: "iris" };
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: row } = await supabase
      .from("portfolios")
      .select("data")
      .eq("slug", slug)
      .maybeSingle();
    const data = (row?.data ?? null) as PortfolioData | null;
    return { data, accent: data?.accent ?? "iris" };
  } catch {
    return { data: null, accent: "iris" };
  }
}

export default async function PortfolioOG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [{ data, accent }, font] = await Promise.all([
    load(slug),
    loadKoreanFont(),
  ]);
  const { site } = mergeContent(data);
  const t = portfolioThemes[accent] ?? portfolioThemes.iris;

  // Accent-tinted glow so each owner's card carries their chosen palette.
  const bg =
    `radial-gradient(820px circle at 12% 16%, ${t.iris}66, transparent 46%), ` +
    `radial-gradient(720px circle at 90% 28%, ${t.cyan}44, transparent 46%), ` +
    `radial-gradient(900px circle at 62% 104%, ${t.magenta}44, transparent 52%)`;

  const owner = font ? site.owner : "Portfolio";
  const role = font ? site.role : "Interactive experience designer";
  const tagline = font ? site.tagline : "";
  const host = site.url.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#06070d",
          backgroundImage: bg,
          color: "#eef0fb",
          fontFamily: font ? "KR" : "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: 26,
            letterSpacing: "0.3em",
            color: "#9aa0b9",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              background: `linear-gradient(135deg, ${t.iris}, ${t.magenta})`,
              display: "flex",
            }}
          />
          LUMINA
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: 30, color: t.violet, display: "flex" }}>
            {role}
          </div>
          <div
            style={{
              fontSize: 110,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              maxWidth: 1040,
            }}
          >
            {owner}
          </div>
          {tagline ? (
            <div style={{ fontSize: 32, color: "#9aa0b9", maxWidth: 940 }}>
              {tagline}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#5b6079",
          }}
        >
          <div style={{ display: "flex" }}>
            {host}/p/{slug}
          </div>
          <div style={{ display: "flex" }}>{font ? "포트폴리오" : "Portfolio"}</div>
        </div>
      </div>
    ),
    {
      ...size,
      ...(font && {
        fonts: [
          { name: "KR", data: font, weight: 700 as const, style: "normal" as const },
        ],
      }),
    },
  );
}
