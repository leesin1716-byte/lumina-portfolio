import type { Metadata } from "next";
import { Pricing } from "@/components/sections/Pricing";

export const metadata: Metadata = {
  title: "요금제",
  description: "무료로 시작하고, 필요할 때 Pro로. LUMINA 포트폴리오 빌더 요금제.",
};

export default function PricingPage() {
  return (
    <div className="pt-24">
      <Pricing />
    </div>
  );
}
