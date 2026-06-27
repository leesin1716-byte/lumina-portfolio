/* ============================================================================
 * 내 것으로 만들기 — 이 파일만 수정하세요.
 * ----------------------------------------------------------------------------
 * 사이트의 모든 텍스트·데이터가 여기 한 곳에 있습니다. 컴포넌트에는 개인 정보가
 * 하드코딩되어 있지 않으므로, 아래 값만 바꾸면 사이트 전체가 갱신됩니다.
 * 개인화 체크리스트:
 *   1. site.owner / role / tagline / email / location / url / timezone
 *   2. socials[] — 실제 링크 + 핸들
 *   3. projects[] — 본인 작업으로 교체 (제목, gradient, 케이스 스터디)
 *   4. about / craft / contact — 본인 이야기, 역량, CTA
 * 참고: 배포 주소가 정해지면 `url`을 실제 주소로 맞추세요 (SEO/OG/canonical용).
 * ========================================================================== */

/**
 * 배포 주소. Vercel 등에 NEXT_PUBLIC_SITE_URL을 설정하면 canonical·OG·sitemap·
 * manifest가 실제 도메인을 따릅니다. 없으면 아래 기본값을 사용합니다.
 * (NEXT_PUBLIC_ 변수는 빌드 시 인라인되므로 빌드 전에 설정하세요.)
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://lumina-portfolio.vercel.app";

export const site = {
  name: "LUMINA",
  /** 실제 이름으로 교체하세요. */
  owner: "당신 이름",
  role: "크리에이티브 프론트엔드 개발자",
  /** 히어로 한 줄 소개. */
  tagline: "모션과 빛, 그리고 코드가 만나는 몰입형 인터페이스를 만듭니다.",
  location: "Seoul, KR",
  /** 푸터의 실시간 현지 시각에 쓰이는 IANA 타임존. */
  timezone: "Asia/Seoul",
  email: "hello@lumina.dev",
  url: SITE_URL,
  description:
    "크리에이티브 프론트엔드 개발자의 포트폴리오 — 몰입형 WebGL, 모션 디자인, 인터랙션 엔지니어링.",
} as const;

export const nav = [
  { label: "홈", href: "#home", index: "01" },
  { label: "소개", href: "#about", index: "02" },
  { label: "작업", href: "#work", index: "03" },
  { label: "역량", href: "#craft", index: "04" },
  { label: "연락", href: "#contact", index: "05" },
] as const;

export const socials = [
  { label: "GitHub", href: "https://github.com", handle: "@yourname" },
  { label: "LinkedIn", href: "https://linkedin.com", handle: "/in/yourname" },
  { label: "Dribbble", href: "https://dribbble.com", handle: "@yourname" },
  { label: "X", href: "https://x.com", handle: "@yourname" },
] as const;

export const hero = {
  /** 키네틱하게 한 줄씩 등장. */
  lines: ["크리에이티브", "프론트엔드", "개발자"],
  /** 헤드라인 아래에서 순환 (기술 용어라 영문 유지). */
  specialties: [
    "WebGL & Shaders",
    "Motion Design",
    "Interaction",
    "Design Systems",
    "Real-time 3D",
  ],
  intro:
    "웹에서 가장 표현력 있는 순간을 디자인하고 엔지니어링합니다 — 한 프레임, 한 셰이더, 하나의 인터랙션까지.",
  scrollCue: "Scroll to explore",
} as const;

export const about = {
  overline: "About",
  heading: "야심 찬 아이디어를, 사람들이 기억하는 인터페이스로.",
  body: [
    "저는 디자인과 엔지니어링의 경계에서 일하는 크리에이티브 개발자입니다. 살아 숨 쉬는 듯한 경험 — 유려한 모션, 실시간 3D, 밀리초 단위로 다듬은 디테일을 만듭니다.",
    "프론트엔드의 모든 영역을 아우릅니다: 디자인 시스템, WebGL과 셰이더, 모션 연출, 그리고 그 모든 것을 모바일에서도 60fps로 돌아가게 하는 성능 작업까지.",
  ],
  stats: [
    { value: "5+", label: "년간의 제작" },
    { value: "40+", label: "출시한 프로젝트" },
    { value: "12", label: "수상 & 소개" },
    { value: "∞", label: "집착한 픽셀" },
  ],
} as const;

export type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  /** 절차적 커버 아트에 쓰이는 2색 그라디언트. */
  gradient: [string, string];
  href?: string;
  /** 케이스 스터디 상세 (프로젝트 모달에 표시). */
  role: string;
  overview: string;
  highlights: string[];
};

export const projects: Project[] = [
  {
    id: "aurora-os",
    title: "Aurora OS",
    category: "제품 · WebGL",
    year: "2025",
    description:
      "실시간 유체 배경과 제스처 기반 윈도우를 갖춘 공간형 운영체제 컨셉.",
    tags: ["React", "Three.js", "GLSL", "Motion"],
    gradient: ["#6d5cff", "#4de2e2"],
    role: "크리에이티브 디렉션 · 엔지니어링",
    overview:
      "Aurora OS는 데스크톱을 살아있는 공간형 표면으로 재해석합니다. GPU 기반 유체 시뮬레이션이 모든 인터랙션에 반응하고, 윈도우는 물리 기반의 탄력적인 모션으로 제스처에 응답합니다.",
    highlights: [
      "120fps로 동작하는 커스텀 GLSL 유체 시뮬레이션",
      "관성과 모멘텀을 가진 제스처 시스템",
      "40개 이상의 컴포넌트가 공유하는 디자인 토큰",
    ],
  },
  {
    id: "synesthesia",
    title: "Synesthesia",
    category: "실험 · 오디오 반응형",
    year: "2025",
    description:
      "브라우저에서 소리로부터 생성적 빛의 장을 그려내는 오디오 반응형 악기.",
    tags: ["Web Audio", "Shaders", "Canvas"],
    gradient: ["#ff5fa2", "#8b7cff"],
    role: "컨셉 · 엔지니어링",
    overview:
      "Synesthesia는 소리를 빛으로 바꿉니다. Web Audio 분석기의 FFT를 프래그먼트 셰이더로 흘려보내, 음악에 맞춰 맥동하고 피어나며 휘어지는 생성적 오로라를 실시간으로 조각합니다.",
    highlights: [
      "실시간 FFT → 셰이더 유니폼 파이프라인",
      "주파수 대역 기반의 생성적 컬러 그레이딩",
      "모바일 GPU에서도 지연 없는 인터랙션",
    ],
  },
  {
    id: "monolith",
    title: "Monolith",
    category: "브랜드 · 몰입형 사이트",
    year: "2024",
    description:
      "하드웨어 스튜디오를 위한 수상작 런칭 사이트 — 스크롤 기반 3D와 시네마틱 전환.",
    tags: ["Next.js", "R3F", "Lenis"],
    gradient: ["#4de2e2", "#c2ff5e"],
    role: "리드 프론트엔드 · 모션",
    overview:
      "하드웨어 스튜디오를 위한 시네마틱 런칭 경험. 스크롤이 3D 제품 공개를 연출하고, 섹션 전환은 영화처럼 편집되며, 타이포그래피는 움직임에 따라 호흡합니다.",
    highlights: [
      "스크롤 기반 3D 제품 공개 (R3F)",
      "Awwwards & FWA 선정",
      "점진적 WebGL 로딩으로 1초 미만 LCP",
    ],
  },
  {
    id: "atlas",
    title: "Atlas",
    category: "데이터 · 시각화",
    year: "2024",
    description:
      "글로벌 데이터셋을 탐색 가능한 애니메이션 지도로 바꾸는 살아있는 데이터 아틀라스.",
    tags: ["D3", "WebGL", "TypeScript"],
    gradient: ["#c2ff5e", "#6d5cff"],
    role: "엔지니어링 · 데이터 시각화",
    overview:
      "Atlas는 글로벌 데이터를 손에 잡히게 만듭니다. 수백만 개의 점이 WebGL 지구본 위에 부드러운 LOD로 렌더링되고, 데이터셋 간 애니메이션 전환과 키보드 기반 탐색기를 제공합니다.",
    highlights: [
      "200만+ 개의 점을 렌더링하는 WebGL 지구본",
      "데이터셋 간 매끄러운 애니메이션 전환",
      "완전한 키보드 탐색 지원",
    ],
  },
  {
    id: "halcyon",
    title: "Halcyon",
    category: "커머스 · 모션",
    year: "2023",
    description:
      "모든 제품 공개가 영화처럼 연출되는 부티크 커머스 경험.",
    tags: ["Next.js", "Motion", "Design System"],
    gradient: ["#ff8a4d", "#ff5fa2"],
    role: "프론트엔드 · 디자인 시스템",
    overview:
      "쇼핑이 갤러리처럼 느껴지는 부티크 커머스 경험. 제품 공개가 안무처럼 연출되고, 장바구니는 의도를 가지고 움직이며, 토큰화된 디자인 시스템이 일관성을 유지합니다.",
    highlights: [
      "안무처럼 연출된 제품 공개",
      "토큰화된 테마형 디자인 시스템",
      "이전 빌드 대비 전환율 +18%",
    ],
  },
];

export type SkillGroup = {
  title: string;
  items: string[];
};

export const craft = {
  overline: "Craft",
  heading: "표현적 엔지니어링을 위해 다듬은 도구함.",
  groups: [
    {
      title: "Engineering",
      items: ["TypeScript", "React", "Next.js", "Node", "GraphQL", "WebGL"],
    },
    {
      title: "Creative",
      items: ["Three.js / R3F", "GLSL Shaders", "Framer Motion", "GSAP", "Canvas", "SVG"],
    },
    {
      title: "Design",
      items: ["Design Systems", "Figma", "Motion Design", "Prototyping", "Typography"],
    },
    {
      title: "Foundations",
      items: ["Performance", "Accessibility", "Animation", "Interaction", "DX"],
    },
  ] satisfies SkillGroup[],
} as const;

export const contact = {
  overline: "Contact",
  heading: "잊지 못할 무언가를\n함께 만들어요.",
  body: "마음에 둔 프로젝트가 있거나, 그냥 셰이더와 모션에 대해 이야기 나누고 싶으신가요? 제 메일함은 언제나 열려 있습니다.",
  cta: "대화 시작하기",
} as const;

/* ============================================================================
 * Portfolio accent themes — curated palettes a user can pick for their /p site.
 * Each remaps the four brand color tokens (applied as CSS variable overrides on
 * the public portfolio). 'iris' is the default look.
 * ========================================================================== */
export const portfolioThemes = {
  iris: { label: "아이리스", iris: "#6d5cff", violet: "#8b7cff", cyan: "#4de2e2", magenta: "#ff5fa2" },
  sunset: { label: "선셋", iris: "#ff6b3d", violet: "#ff8a5c", cyan: "#ffd166", magenta: "#ff5f6d" },
  ocean: { label: "오션", iris: "#3b82f6", violet: "#6366f1", cyan: "#22d3ee", magenta: "#38bdf8" },
  forest: { label: "포레스트", iris: "#10b981", violet: "#34d399", cyan: "#6ee7b7", magenta: "#84cc16" },
  mono: { label: "모노", iris: "#9ca3af", violet: "#cbd5e1", cyan: "#e2e8f0", magenta: "#94a3b8" },
} as const;

export type PortfolioThemeKey = keyof typeof portfolioThemes;

/* ============================================================================
 * Bundled content + per-user merge — powers the SaaS portfolio builder.
 * The default values above are the "demo"; each user stores partial overrides
 * (jsonb) that get merged on top to render their own immersive portfolio.
 * ========================================================================== */

export const defaultContent = {
  site,
  nav,
  socials,
  hero,
  about,
  projects,
  craft,
  contact,
};

export type Content = typeof defaultContent;

export type PortfolioData = Partial<{
  site: Partial<{
    name: string;
    owner: string;
    role: string;
    tagline: string;
    location: string;
    timezone: string;
    email: string;
    url: string;
    description: string;
  }>;
  hero: Partial<{
    lines: string[];
    specialties: string[];
    intro: string;
    scrollCue: string;
  }>;
  about: Partial<{
    overline: string;
    heading: string;
    body: string[];
    stats: { value: string; label: string }[];
  }>;
  contact: Partial<{
    overline: string;
    heading: string;
    body: string;
    cta: string;
  }>;
  craft: Partial<{ overline: string; heading: string; groups: SkillGroup[] }>;
  projects: Project[];
  socials: { label: string; href: string; handle?: string }[];
  /** Pro 전용: 공개 포트폴리오의 "LUMINA로 제작" 배지를 숨깁니다. */
  hideBadge: boolean;
  /** 공개 포트폴리오 액센트 테마 (없으면 기본 'iris'). */
  accent: PortfolioThemeKey;
}>;

/** Merge a user's partial overrides over the defaults into a full Content. */
export function mergeContent(d?: PortfolioData | null): Content {
  if (!d) return defaultContent;
  return {
    ...defaultContent,
    site: { ...defaultContent.site, ...d.site },
    hero: { ...defaultContent.hero, ...d.hero },
    about: { ...defaultContent.about, ...d.about },
    contact: { ...defaultContent.contact, ...d.contact },
    craft: { ...defaultContent.craft, ...d.craft },
    projects: d.projects ?? defaultContent.projects,
    socials: d.socials ?? defaultContent.socials,
  } as Content;
}
