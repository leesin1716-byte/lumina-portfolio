/**
 * Single source of truth for all editable copy & data.
 * Swap these values to make the portfolio your own — nothing in the
 * components hard-codes identity, so changing this file changes the site.
 */

export const site = {
  name: "LUMINA",
  /** Replace with your real name. */
  owner: "Your Name",
  role: "Creative Frontend Developer",
  /** Short hero statement. */
  tagline: "I craft immersive interfaces where motion, light, and code meet.",
  location: "Seoul, KR",
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
