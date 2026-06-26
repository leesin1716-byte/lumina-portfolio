import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    // Note: private pages (/dashboard, /billing, …) carry a noindex meta tag
    // and are intentionally NOT disallowed here, so crawlers can fetch them
    // and honor the noindex. Only the non-page API surface is disallowed.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
