/**
 * Starter templates for onboarding — one-click presets that fill the identity,
 * hero and craft fields so a new owner isn't staring at the demo defaults.
 * They only seed the editor (nothing is saved until the user reviews + saves),
 * and never touch personal fields like name, email, projects or socials.
 */
export type StarterTemplate = {
  key: string;
  label: string;
  emoji: string;
  blurb: string;
  role: string;
  tagline: string;
  heroLines: string[];
  specialties: string[];
  heroIntro: string;
  aboutHeading: string;
  aboutBody: string[];
  craftGroups: { title: string; items: string[] }[];
};

export const starterTemplates: StarterTemplate[] = [
  {
    key: "frontend",
    label: "프론트엔드 개발자",
    emoji: "⚡",
    blurb: "인터랙티브 웹·UI 엔지니어링 중심",
    role: "프론트엔드 개발자",
    tagline: "사용자가 머무르고 싶은 인터페이스를 코드로 빚습니다.",
    heroLines: ["코드로 빚는", "살아있는", "인터페이스"],
    specialties: ["React · Next.js", "타입스크립트", "인터랙션", "성능 최적화", "디자인 시스템"],
    heroIntro:
      "프로덕트의 첫인상부터 마지막 클릭까지, 빠르고 매끄러운 경험을 만드는 데 집중합니다.",
    aboutHeading: "탄탄한 기반 위에 섬세한 디테일을 더합니다.",
    aboutBody: [
      "복잡한 요구사항을 명확한 컴포넌트 구조로 풀어내고, 접근성과 성능을 기본값으로 둡니다.",
      "디자이너·백엔드와의 경계에서 매끄럽게 협업하며 제품을 끝까지 책임집니다.",
    ],
    craftGroups: [
      { title: "Engineering", items: ["TypeScript", "React", "Next.js", "Node", "Testing"] },
      { title: "Interface", items: ["Tailwind", "Framer Motion", "Accessibility", "Design Systems"] },
      { title: "Foundations", items: ["Performance", "DX", "CI/CD", "Web Vitals"] },
    ],
  },
  {
    key: "designer",
    label: "프로덕트 디자이너",
    emoji: "✦",
    blurb: "사용자 경험·UI 디자인 중심",
    role: "프로덕트 디자이너",
    tagline: "문제를 구조로, 구조를 아름다운 경험으로 옮깁니다.",
    heroLines: ["사용자를 위한", "사려 깊은", "프로덕트 디자인"],
    specialties: ["UX 리서치", "UI 디자인", "프로토타이핑", "디자인 시스템", "인터랙션"],
    heroIntro:
      "데이터와 공감 사이에서 균형을 잡으며, 쓰기 쉬우면서도 기억에 남는 제품을 설계합니다.",
    aboutHeading: "보기 좋은 것과 쓰기 좋은 것 사이의 균형.",
    aboutBody: [
      "리서치로 문제를 정의하고, 빠른 프로토타입으로 가설을 검증하며 디테일을 다듬습니다.",
      "디자인 시스템으로 일관성을 지키면서도 순간순간의 인터랙션에 정성을 담습니다.",
    ],
    craftGroups: [
      { title: "Design", items: ["UI Design", "UX Research", "Figma", "Prototyping", "Typography"] },
      { title: "System", items: ["Design Systems", "Tokens", "Accessibility", "Motion"] },
      { title: "Collaboration", items: ["User Testing", "Workshop", "Handoff", "Storytelling"] },
    ],
  },
  {
    key: "brand",
    label: "브랜드 · 그래픽 디자이너",
    emoji: "◐",
    blurb: "브랜드 아이덴티티·비주얼 중심",
    role: "브랜드 디자이너",
    tagline: "한 장의 이미지로 브랜드의 목소리를 들려줍니다.",
    heroLines: ["기억에 새기는", "선명한", "브랜드 아이덴티티"],
    specialties: ["브랜딩", "아트 디렉션", "타이포그래피", "그래픽 디자인", "비주얼 시스템"],
    heroIntro:
      "로고 한 점부터 전체 캠페인까지, 일관되고 강렬한 브랜드 언어를 디자인합니다.",
    aboutHeading: "디테일이 모여 브랜드의 인상이 됩니다.",
    aboutBody: [
      "브랜드의 본질을 찾아 시각 언어로 번역하고, 어디에 놓여도 흔들리지 않는 시스템을 만듭니다.",
      "타이포그래피와 색, 여백의 호흡까지 세심하게 설계합니다.",
    ],
    craftGroups: [
      { title: "Brand", items: ["Identity", "Art Direction", "Logo", "Guidelines"] },
      { title: "Visual", items: ["Typography", "Color", "Layout", "Illustration"] },
      { title: "Tools", items: ["Illustrator", "Photoshop", "InDesign", "Figma"] },
    ],
  },
  {
    key: "photo",
    label: "포토그래퍼 · 비주얼 아티스트",
    emoji: "❖",
    blurb: "사진·영상·비주얼 작업 중심",
    role: "포토그래퍼 · 비주얼 아티스트",
    tagline: "빛과 순간을 담아 이야기로 남깁니다.",
    heroLines: ["빛으로 쓰는", "사라지지 않을", "순간의 기록"],
    specialties: ["사진", "영상", "색 보정", "아트 디렉션", "비주얼 스토리텔링"],
    heroIntro:
      "스쳐가는 장면 속에서 오래 남을 한 컷을 찾아, 감정이 전해지는 이미지로 완성합니다.",
    aboutHeading: "프레임 안에 담는 건 결국 감정입니다.",
    aboutBody: [
      "피사체와의 호흡을 중요하게 여기며, 자연스러운 순간을 섬세하게 포착합니다.",
      "촬영부터 후보정까지 일관된 톤으로 하나의 시리즈를 완성합니다.",
    ],
    craftGroups: [
      { title: "Capture", items: ["Portrait", "Documentary", "Editorial", "Lighting"] },
      { title: "Post", items: ["Color Grading", "Retouching", "Lightroom", "Capture One"] },
      { title: "Direction", items: ["Art Direction", "Styling", "Storyboarding"] },
    ],
  },
];
