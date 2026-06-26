"use client";

import { motion } from "framer-motion";
import { AnimatedText } from "@/components/ui/AnimatedText";

const EASE = [0.16, 1, 0.3, 1] as const;

const features = [
  {
    title: "몰입형 3D & 인터랙션",
    desc: "커서를 따라오는 3D 로봇, WebGL 셰이더, 키네틱 타이포까지 — 코드 없이 그대로.",
    icon: "✦",
  },
  {
    title: "코드 없이 편집",
    desc: "대시보드에서 이름·소개·프로젝트만 입력하면 끝. 디자인은 저희가 책임집니다.",
    icon: "✎",
  },
  {
    title: "즉시 호스팅 & 공유",
    desc: "공개 버튼 하나로 lumina.app/p/내이름 주소가 생성돼요. 링크만 보내세요.",
    icon: "↗",
  },
  {
    title: "다크·라이트 + 반응형",
    desc: "어떤 기기, 어떤 테마에서도 완벽하게. 접근성과 60fps 성능은 기본.",
    icon: "◑",
  },
];

const steps = [
  { n: "01", t: "가입하기", d: "이메일이나 구글로 몇 초면 시작." },
  { n: "02", t: "내용 입력", d: "대시보드에서 정보와 프로젝트를 채워요." },
  { n: "03", t: "공개 & 공유", d: "공개 버튼을 누르고 링크를 보내세요." },
];

export function ProductPitch() {
  return (
    <section
      id="product"
      className="relative scroll-mt-24 overflow-hidden border-t border-line py-28 sm:py-36"
    >
      <div
        aria-hidden
        className="aurora-layer pointer-events-none absolute left-1/2 top-0 -z-0 h-[40vmax] w-[40vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(109,92,255,0.18),transparent_65%)] blur-[100px]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        {/* Intro */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-violet">
            포트폴리오 빌더
          </p>
          <AnimatedText
            as="h2"
            text={"방금 본 이 경험,\n당신의 것으로."}
            className="font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl"
          />
          <p className="mx-auto mt-6 max-w-md text-pretty text-muted">
            LUMINA는 개발자·디자이너를 위한 몰입형 포트폴리오 빌더예요. 내용만
            입력하면, 지금 이 페이지 같은 사이트가 완성됩니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/signup"
              data-cursor="hover"
              className="btn-sheen rounded-full bg-fg px-7 py-3.5 text-sm font-semibold text-bg transition-colors hover:bg-violet"
            >
              무료로 시작하기
            </a>
            <a
              href="/pricing"
              data-cursor="hover"
              className="rounded-full border border-line-strong px-7 py-3.5 text-sm font-medium transition-colors hover:border-violet"
            >
              요금제 보기
            </a>
          </div>
        </div>

        {/* Honest stats */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          {[
            { v: "0줄", l: "필요한 코드" },
            { v: "5분", l: "완성까지" },
            { v: "60fps", l: "부드러운 성능" },
            { v: "₩0", l: "시작 비용" },
          ].map((s) => (
            <div key={s.l} className="bg-bg-soft p-6 text-center">
              <div className="font-display text-3xl font-bold text-gradient sm:text-4xl">
                {s.v}
              </div>
              <div className="mt-1.5 text-sm text-muted">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="rounded-2xl border border-line bg-bg-soft p-6"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet/12 text-lg text-violet">
                {f.icon}
              </span>
              <h3 className="mt-5 font-medium">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-24">
          <h3 className="text-center font-display text-2xl font-bold tracking-tight sm:text-3xl">
            이렇게 작동해요
          </h3>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                className="relative text-center"
              >
                <span className="font-display text-5xl font-bold text-gradient">
                  {s.n}
                </span>
                <h4 className="mt-4 font-medium">{s.t}</h4>
                <p className="mt-1.5 text-sm text-muted">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-24 max-w-2xl">
          <h3 className="mb-8 text-center font-display text-2xl font-bold tracking-tight sm:text-3xl">
            자주 묻는 질문
          </h3>
          <div className="flex flex-col divide-y divide-line">
            {[
              {
                q: "코딩을 몰라도 되나요?",
                a: "네. 대시보드에 내용만 입력하면 디자인·3D·애니메이션은 모두 자동으로 적용돼요.",
              },
              {
                q: "내 주소로 바로 공유되나요?",
                a: "공개 버튼을 누르면 lumina.app/p/내이름 링크가 생기고, 어디든 공유할 수 있어요.",
              },
              {
                q: "나중에 Pro로 올릴 수 있나요?",
                a: "물론이죠. 무료로 시작하고, 필요할 때 언제든 업그레이드할 수 있어요.",
              },
            ].map((f) => (
              <div key={f.q} className="py-5">
                <h4 className="font-medium">{f.q}</h4>
                <p className="mt-2 text-pretty text-sm text-muted">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="relative mt-24 overflow-hidden rounded-3xl border border-violet/30 bg-bg-soft p-10 text-center sm:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(139,124,255,0.16),transparent_60%)]"
          />
          <div className="relative">
            <h3 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              지금, 무료로 시작하세요
            </h3>
            <p className="mx-auto mt-3 max-w-md text-pretty text-muted">
              카드 등록도 필요 없어요. 5분이면 나만의 몰입형 포트폴리오가
              완성됩니다.
            </p>
            <a
              href="/signup"
              data-cursor="hover"
              className="btn-sheen mt-8 inline-block rounded-full bg-fg px-8 py-4 text-sm font-semibold text-bg transition-colors hover:bg-violet"
            >
              무료로 내 포트폴리오 만들기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
