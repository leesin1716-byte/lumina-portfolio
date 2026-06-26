import type { Metadata } from "next";
import { Pricing } from "@/components/sections/Pricing";

const title = "요금제";
const description =
  "무료로 시작하고, 필요할 때 Pro로. LUMINA 포트폴리오 빌더 요금제 — 무료 플랜과 월 9,900원 Pro.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: `${title} — LUMINA`,
    description,
    url: "/pricing",
    siteName: "LUMINA",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: `${title} — LUMINA`, description },
};

export default function PricingPage() {
  return (
    <div className="pt-24">
      <Pricing />
    </div>
  );
}
