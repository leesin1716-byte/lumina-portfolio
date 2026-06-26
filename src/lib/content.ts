/* ============================================================================
 * MAKE IT YOURS — edit this file only.
 * ----------------------------------------------------------------------------
 * This is the single source of truth for ALL copy & data. Nothing in the
 * components hard-codes identity, so editing the values below updates the
 * whole site. Quick checklist to personalise:
 *   1. site.owner / role / tagline / email / location / url / timezone
 *   2. socials[] — your real links + handles
 *   3. projects[] — replace with your real work (title, gradient, case study)
 *   4. about / craft / contact — your story, skills, and call to action
 * Tip: keep `url` in sync with where you deploy (used for SEO/OG/canonical).
 * ========================================================================== */

export const site = {
  name: "LUMINA",
  /** Replace with your real name. */
  owner: "Your Name",
  role: "Creative Frontend Developer",
  /** Short hero statement. */
  tagline: "I craft immersive interfaces where motion, light, and code meet.",
  location: "Seoul, KR",
  /** IANA timezone for the live "local time" in the footer. */
  timezone: "Asia/Seoul",
  email: "hello@lumina.dev",
  url: "https://lumina-portfolio.vercel.app",
  description:
    "Portfolio of a creative frontend developer — immersive WebGL, motion design, and interaction engineering.",
} as const;

export const nav = [
  { label: "Home", href: "#home", index: "01" },
  { label: "About", href: "#about", index: "02" },
  { label: "Work", href: "#work", index: "03" },
  { label: "Craft", href: "#craft", index: "04" },
  { label: "Contact", href: "#contact", index: "05" },
] as const;

export const socials = [
  { label: "GitHub", href: "https://github.com", handle: "@yourname" },
  { label: "LinkedIn", href: "https://linkedin.com", handle: "/in/yourname" },
  { label: "Dribbble", href: "https://dribbble.com", handle: "@yourname" },
  { label: "X", href: "https://x.com", handle: "@yourname" },
] as const;

export const hero = {
  /** Rendered as kinetic, staggered lines. */
  lines: ["CREATIVE", "FRONTEND", "DEVELOPER"],
  /** Cycled under the headline. */
  specialties: [
    "WebGL & Shaders",
    "Motion Design",
    "Interaction",
    "Design Systems",
    "Real-time 3D",
  ],
  intro:
    "Designing and engineering the web's most expressive moments — one frame, one shader, one interaction at a time.",
  scrollCue: "Scroll to explore",
} as const;

export const about = {
  overline: "About",
  heading:
    "I turn ambitious ideas into interfaces people remember.",
  body: [
    "I'm a creative developer working at the intersection of design and engineering. I build experiences that feel alive — fluid motion, real-time 3D, and details tuned to the millisecond.",
    "My craft spans the full stack of the front end: design systems, WebGL and shaders, motion choreography, and the performance work that makes it all run at 60fps on a phone.",
  ],
  stats: [
    { value: "5+", label: "Years crafting" },
    { value: "40+", label: "Projects shipped" },
    { value: "12", label: "Awards & features" },
    { value: "∞", label: "Pixels obsessed over" },
  ],
} as const;

export type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  /** Two-stop gradient used for the procedural cover art. */
  gradient: [string, string];
  href?: string;
  /** Case-study detail (shown in the project modal). */
  role: string;
  overview: string;
  highlights: string[];
};

export const projects: Project[] = [
  {
    id: "aurora-os",
    title: "Aurora OS",
    category: "Product · WebGL",
    year: "2025",
    description:
      "A spatial operating-system concept with a real-time fluid background and gesture-driven windows.",
    tags: ["React", "Three.js", "GLSL", "Motion"],
    gradient: ["#6d5cff", "#4de2e2"],
    role: "Creative Direction · Engineering",
    overview:
      "Aurora OS reimagines the desktop as a living, spatial surface. A GPU-driven fluid simulation reacts to every interaction while windows respond to gestures with springy, physically-grounded motion.",
    highlights: [
      "Custom GLSL fluid simulation running at 120fps",
      "Gesture system with momentum and inertia",
      "Design tokens shared across 40+ components",
    ],
  },
  {
    id: "synesthesia",
    title: "Synesthesia",
    category: "Experiment · Audio-reactive",
    year: "2025",
    description:
      "An audio-reactive instrument that paints generative light fields from sound in the browser.",
    tags: ["Web Audio", "Shaders", "Canvas"],
    gradient: ["#ff5fa2", "#8b7cff"],
    role: "Concept · Engineering",
    overview:
      "Synesthesia turns sound into light. The Web Audio analyser feeds an FFT into a fragment shader, sculpting generative aurora fields that pulse, bloom, and bend with the music in real time.",
    highlights: [
      "Real-time FFT → shader uniform pipeline",
      "Generative color grading from frequency bands",
      "Zero-latency interaction on mobile GPUs",
    ],
  },
  {
    id: "monolith",
    title: "Monolith",
    category: "Brand · Immersive Site",
    year: "2024",
    description:
      "Award-winning launch site for a hardware studio — scroll-driven 3D and cinematic transitions.",
    tags: ["Next.js", "R3F", "Lenis"],
    gradient: ["#4de2e2", "#c2ff5e"],
    role: "Lead Frontend · Motion",
    overview:
      "A cinematic launch experience for a hardware studio. Scroll choreographs a 3D product reveal, with section transitions cut like a film and type that breathes as you move.",
    highlights: [
      "Scroll-driven 3D product reveal (R3F)",
      "Featured on Awwwards & FWA",
      "Sub-second LCP with progressive WebGL",
    ],
  },
  {
    id: "atlas",
    title: "Atlas",
    category: "Data · Visualization",
    year: "2024",
    description:
      "A living data atlas turning global datasets into an explorable, animated cartography.",
    tags: ["D3", "WebGL", "TypeScript"],
    gradient: ["#c2ff5e", "#6d5cff"],
    role: "Engineering · Data Viz",
    overview:
      "Atlas makes global data tangible. Millions of points render on a WebGL globe with smooth level-of-detail, animated transitions between datasets, and an accessible, keyboard-driven explorer.",
    highlights: [
      "WebGL globe rendering 2M+ points",
      "Animated transitions between datasets",
      "Fully keyboard-navigable explorer",
    ],
  },
  {
    id: "halcyon",
    title: "Halcyon",
    category: "Commerce · Motion",
    year: "2023",
    description:
      "A boutique commerce experience where every product reveal is choreographed like a film.",
    tags: ["Next.js", "Motion", "Design System"],
    gradient: ["#ff8a4d", "#ff5fa2"],
    role: "Frontend · Design System",
    overview:
      "A boutique commerce experience where shopping feels like a gallery. Product reveals are choreographed, the cart animates with intention, and a tokenized design system keeps it all consistent.",
    highlights: [
      "Choreographed product reveals",
      "Tokenized, themeable design system",
      "+18% conversion vs. the previous build",
    ],
  },
];

export type SkillGroup = {
  title: string;
  items: string[];
};

export const craft = {
  overline: "Craft",
  heading: "A toolkit tuned for expressive engineering.",
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
  heading: "Let's build something\nunforgettable.",
  body: "Have a project in mind, or just want to talk shaders and motion? My inbox is always open.",
  cta: "Start a conversation",
} as const;
