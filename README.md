# LUMINA — Creative Frontend Portfolio

An immersive, interactive portfolio experience built to showcase creative
frontend engineering: real-time WebGL, motion design, and interaction
craft. Dark, cinematic, aurora-lit.

## Highlights

- **3D cursor-following robot companion** — a stylized robot head built
  entirely from Three.js primitives (no external model). Its gaze tracks the
  cursor, with glowing visor eyes, a blink, a pulsing antenna, side pods, a
  halo ring, bloom postprocessing, and camera parallax. Reduced-motion and
  mobile gracefully fall back to a pure-CSS aurora.
- **WebGL liquid-distortion gallery** — hovering a project reveals a
  shader-driven (GLSL fbm domain-warp) gradient card that follows the cursor
  and morphs colors per project.
- **Signature interactions** — custom cursor with magnetic states, magnetic
  buttons, Lenis smooth scrolling, masked kinetic typography, a counting
  preloader, scroll progress, film grain, and a scroll-spy navbar.
- **Accessible & performant** — `prefers-reduced-motion` aware throughout
  (via `MotionConfig`, Lenis/WebGL opt-out), keyboard navigable with a skip
  link and focus-visible states, WebGL contexts gated to the viewport, fully
  responsive.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) · React 19 · TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) — CSS-first design tokens
- [Framer Motion](https://www.framer.com/motion/) — animation & orchestration
- [React Three Fiber](https://r3f.docs.pmnd.rs/) · drei · postprocessing —
  WebGL/3D
- [Lenis](https://lenis.darkroom.engineering/) — smooth scrolling

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Make it yours

All copy and data live in [`src/lib/content.ts`](./src/lib/content.ts) —
identity, navigation, projects, skills, and contact. Edit that one file and
the whole site updates. Swap `site.owner`, `site.email`, the `projects`
array, and the social links.

## Structure

```
src/
├─ app/                 # routes, layout, metadata (robots, sitemap, OG image)
├─ components/
│  ├─ canvas/           # R3F scenes: robot companion, works shader preview
│  ├─ providers/        # smooth scroll + motion config
│  ├─ sections/         # Hero, About, Works, Craft, Contact, Footer
│  └─ ui/               # cursor, magnetic button, preloader, kinetic text…
└─ lib/                 # content, hooks, utils
```

Crafted with light & code.
