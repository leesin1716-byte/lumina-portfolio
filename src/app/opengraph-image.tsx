import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

export const runtime = "edge";
export const alt = `${site.owner} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 28,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
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

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            Creative Frontend Developer
          </div>
          <div style={{ fontSize: 34, color: "#9aa0b9", maxWidth: 820 }}>
            Immersive interfaces where motion, light & code meet.
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
          <div style={{ display: "flex" }}>Portfolio</div>
          <div style={{ display: "flex" }}>{site.location}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
