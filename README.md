# LUMINA — 몰입형 포트폴리오 빌더 (SaaS)

코드 한 줄 없이, 가입 → 내용 입력만으로 **몰입형 3D 포트폴리오**를 만들고
`lumina.app/p/내이름` 주소로 공개·공유하는 한국어 SaaS. 랜딩 자체가 제품의
라이브 데모입니다.

## 핵심 기능

- **데이터 주도 몰입형 디자인** — 커서 추종 3D 로봇(R3F), WebGL 리퀴드
  디스토션 갤러리, 키네틱 타이포, 패럴랙스, 다크/라이트 토글. 사용자 데이터로
  그대로 렌더 (`/p/[slug]`).
- **인증** — Supabase Auth (이메일/비밀번호 + Google OAuth).
- **대시보드** (`/dashboard`) — 이름·소개·프로젝트·소셜·공개 주소(slug) 편집,
  공개 토글, 링크 복사, 계정/플랜.
- **구독 결제** — TossPayments 빌링으로 Pro 월 구독 (`/pricing` → 빌링 인증
  → `/billing/success`에서 빌링키 발급·결제·plan=pro).
- **공유 최적화** — `/p/[slug]` 사용자별 OG/SEO 메타데이터.
- **접근성·성능** — 폼 라벨, 포커스, `prefers-reduced-motion`, WebGL 뷰포트
  게이팅, 반응형(390/768/1440/1920).

## 기술 스택

- [Next.js 16](https://nextjs.org) (App Router) · React 19 · TypeScript ·
  [Tailwind v4](https://tailwindcss.com)
- [Supabase](https://supabase.com) (Auth + Postgres) · `@supabase/ssr`
- [TossPayments](https://www.tosspayments.com) `@tosspayments/payment-sdk`
- [Framer Motion](https://www.framer.com/motion/) · [R3F](https://r3f.docs.pmnd.rs/)
  · drei · postprocessing · [Lenis](https://lenis.darkroom.engineering/) ·
  Pretendard

## 설치 & 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

> 키가 없어도 사이트는 정상 동작합니다(인증/결제는 비활성). 키를 넣으면 켜집니다.

## 백엔드 설정 (인증·DB·결제 켜기)

1. **Supabase** — [supabase.com](https://supabase.com)에서 프로젝트 생성 →
   SQL Editor에서 `supabase/schema.sql` 실행 → (결제용) `supabase/billing.sql`
   → (방문 분석용) `supabase/analytics.sql` 실행. Settings → API에서 키 복사.
2. **TossPayments** — 가입 후 테스트 클라이언트/시크릿 키 발급.
3. 프로젝트 루트에 **`.env.local`** 생성 (`.env.example` 참고):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_TOSS_CLIENT_KEY=...
TOSS_SECRET_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. 서버 재시작. (Google 로그인은 Supabase → Authentication → Providers에서
   Google 활성화.)

## 배포 (GitHub → Vercel)

```bash
git push origin master   # 연결된 Vercel이 자동 재배포
```

프로덕션에서 인증/결제/분석이 동작하려면 **Vercel 프로젝트 Settings → Environment
Variables**에 위 `.env.local` 값들을 동일하게 등록하되 `NEXT_PUBLIC_SITE_URL`은
실제 배포 도메인으로 설정하고, Supabase SQL 에디터에서 `supabase/schema.sql` +
`supabase/billing.sql` + `supabase/analytics.sql` + `supabase/messages.sql` +
`supabase/daily-views.sql` 다섯 파일을 모두 실행해야 합니다.

## 라우트

| 경로 | 설명 |
|---|---|
| `/` | 랜딩 (몰입형 데모 + 제품 소개·요금제 CTA) |
| `/pricing` | 요금제 (무료 / Pro) |
| `/login`, `/signup` | 인증 |
| `/forgot-password`, `/reset-password` | 비밀번호 재설정 |
| `/dashboard` | 포트폴리오 편집 (보호됨) |
| `/p/[slug]` | 공개 포트폴리오 |
| `/billing/success`, `/billing/fail` | 결제 결과 |

## 구조

```
src/
├─ app/
│  ├─ (site)/        # 랜딩 + 마케팅 chrome (nav/footer)
│  ├─ (auth)/        # 로그인 / 회원가입 / 비밀번호 재설정
│  ├─ dashboard/     # 편집기 (보호됨)
│  ├─ p/[slug]/      # 공개 포트폴리오
│  └─ billing/       # 결제 결과
├─ components/       # canvas(R3F) · sections · ui · auth · dashboard · billing
├─ lib/              # content(+merge) · supabase · toss · hooks · utils
├─ proxy.ts          # 인증 미들웨어(세션 갱신 + /dashboard 보호)
└─ ...
supabase/            # schema.sql, billing.sql, analytics.sql
```

빛과 코드로 만들었습니다.
