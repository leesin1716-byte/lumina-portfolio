import type { Content } from "@/lib/content";

/**
 * Builds schema.org JSON-LD for a portfolio so search engines and social
 * crawlers understand it as a person's professional profile. Emitted as a
 * <script type="application/ld+json"> on the public /p page (and the root).
 */
export function portfolioJsonLd(content: Content, url: string) {
  const { site, socials, craft, projects } = content;

  // Flatten skills as the person's areas of expertise (deduped, capped).
  const knowsAbout = Array.from(
    new Set(craft.groups.flatMap((g) => g.items)),
  ).slice(0, 24);

  const sameAs = socials
    .map((s) => s.href)
    .filter((h) => /^https?:\/\//.test(h));

  const person = {
    "@type": "Person",
    name: site.owner,
    jobTitle: site.role,
    description: site.description || site.tagline,
    url,
    email: site.email ? `mailto:${site.email}` : undefined,
    address: site.location
      ? { "@type": "PostalAddress", addressLocality: site.location }
      : undefined,
    knowsAbout: knowsAbout.length ? knowsAbout : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${site.owner} — ${site.role}`,
    url,
    inLanguage: "ko-KR",
    mainEntity: person,
    // Surface the showcased work as creative works tied to the author.
    hasPart: projects.slice(0, 12).map((p) => ({
      "@type": "CreativeWork",
      name: p.title,
      about: p.category,
      ...(p.year && { dateCreated: String(p.year) }),
    })),
  };
}
