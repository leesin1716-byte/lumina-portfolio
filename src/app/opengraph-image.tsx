import { ImageResponse } from "next/og";
import { site } from "@/lib/content";
import { loadKoreanFont } from "@/lib/og-font";

export const runtime = "edge";
export const alt = `${site.owner} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const font = await loadKoreanFont();
  // Korean when the typeface loads; a safe Latin line otherwise (Satori's
  // built-in font has no Hangul, so we never paint Korean without the font).
  const heading = font
    ? "빛과 모션으로 빚어내는 몰입형 경험"
    : "Immersive experiences in light, motion & code";
  const sub = font ? site.tagline : "Crafted with WebGL, motion & interaction.";
  const footer = font ? site.role : "Interactive experience designer";
  const loc = font ? site.location : "Seoul, Korea";

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
          backgroundImage:
            "radial-gradient(800px circle at 12% 18%, rgba(109,92,255,0.5), transparent 45%), radial-gradient(700px circle at 88% 30%, rgba(77,226,226,0.35), transparent 45%), radial-gradient(900px circle at 60% 100%, rgba(255,95,162,0.35), transparent 50%)",
          color: "#eef0fb",
          fontFamily: font ? "KR" : "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 28,
            letterSpacing: "0.3em",
            color: "#9aa0b9",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              background: "linear-gradient(135deg,#6d5cff,#ff5fa2)",
              display: "flex",
            }}
          />
          {site.name}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              maxWidth: 1000,
            }}
          >
            {heading}
          </div>
          <div style={{ fontSize: 32, color: "#9aa0b9", maxWidth: 880 }}>
            {sub}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#5b6079",
          }}
        >
          <div style={{ display: "flex" }}>{footer}</div>
          <div style={{ display: "flex" }}>{loc}</div>
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
