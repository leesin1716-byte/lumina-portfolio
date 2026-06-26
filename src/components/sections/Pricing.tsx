"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { UpgradeButton } from "@/components/billing/UpgradeButton";

const EASE = [0.16, 1, 0.3, 1] as const;

const tiers = [
  {
    name: "무료",
    price: "₩0",
    period: "",
    desc: "지금 바로 시작하기",
    cta: "무료로 시작",
    href: "/signup",
    highlight: false,
    features: [
      "포트폴리오 1개",
      "lumina.app/p/내이름 호스팅",
      "다크 / 라이트 테마",
      "3D 로봇 & 몰입형 인터랙션",
      "모바일 반응형",
    ],
  },
  {
    name: "Pro",
    price: "₩9,900",
    period: "/월",
    desc: "프로답게, 제한 없이",
    cta: "Pro 시작하기",
    href: "/signup?plan=pro",
    highlight: true,
    features: [
      "무료의 모든 기능",
      "LUMINA 뱃지 제거",
      "방문자 분석 대시보드",
      "무제한 프로젝트 등록",
      "우선 이메일 지원",
    ],
  },
] as const;

const faqs = [
  {
    q: "정말 무료인가요?",
    a: "네. 무료 플랜으로 포트폴리오 1개를 만들어 lumina.app 주소로 공개할 수 있어요. 카드 등록도 필요 없습니다.",
  },
  {
    q: "결제는 안전한가요?",
    a: "결제는 국내 토스페이먼츠로 안전하게 처리되며, 카드 정보는 저희 서버에 저장되지 않습니다.",
  },
  {
    q: "언제든 해지할 수 있나요?",
    a: "네. 대시보드에서 언제든 해지할 수 있고, 남은 기간 동안은 Pro 기능을 계속 쓸 수 있어요.",
  },
];

export function Pricing() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28 sm:px-8">
      <div className="mb-14 text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-violet">
          Pricing
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
          단순한 요금제
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty text-muted">
          지금 무료로 시작하고, 필요할 때 Pro로 올리세요. 숨은 비용은 없습니다.
        </p>
      </div>

      <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
        {tiers.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
            className={cn(
              "relative flex flex-col rounded-3xl border p-7",
              t.highlight
                ? "border-violet/50 bg-bg-soft shadow-2xl shadow-violet/10"
                : "border-line bg-bg-soft",
            )}
          >
            {t.highlight && (
              <>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(120%_60%_at_50%_0%,rgba(139,124,255,0.16),transparent_60%)]"
                />
                <span className="absolute right-6 top-7 rounded-full bg-gradient-to-r from-iris to-magenta px-3 py-1 text-[11px] font-semibold text-white">
                  추천
                </span>
              </>
            )}
            <div className="relative">
              <h2 className="font-display text-xl font-bold">{t.name}</h2>
              <p className="mt-1 text-sm text-muted">{t.desc}</p>
              <div className="mt-5 flex items-end gap-1">
                <span className="font-display text-4xl font-bold tracking-tight">
                  {t.price}
                </span>
                <span className="mb-1 text-sm text-muted">{t.period}</span>
              </div>

              {t.highlight ? (
                <div className="mt-6">
                  <UpgradeButton className="btn-sheen block w-full rounded-full bg-fg px-5 py-3 text-center text-sm font-semibold text-bg transition-colors hover:bg-violet">
                    {t.cta}
                  </UpgradeButton>
                </div>
              ) : (
                <a
                  href={t.href}
                  data-cursor="hover"
                  className="btn-sheen mt-6 block rounded-full border border-line-strong px-5 py-3 text-center text-sm font-semibold transition-colors hover:border-violet"
                >
                  {t.cta}
                </a>
              )}

              <ul className="mt-7 flex flex-col gap-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-violet/15 text-violet">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    <span className="text-muted">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-faint">
        결제는 토스페이먼츠로 안전하게 처리됩니다.
      </p>

      {/* FAQ */}
      <div className="mx-auto mt-20 max-w-2xl">
        <h2 className="mb-8 text-center font-display text-2xl font-bold tracking-tight">
          자주 묻는 질문
        </h2>
        <div className="flex flex-col divide-y divide-line">
          {faqs.map((f) => (
            <div key={f.q} className="py-5">
              <h3 className="font-medium">{f.q}</h3>
              <p className="mt-2 text-pretty text-sm text-muted">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
