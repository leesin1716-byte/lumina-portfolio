/**
 * Loads Pretendard (the site's own typeface) as OTF bytes for use with
 * `next/og`, which runs on Satori and cannot read the CDN-loaded webfont.
 *
 * Satori accepts ttf / otf / woff (not woff2), so we pull the static OTF
 * straight from jsDelivr. Returns `null` on any failure so callers can fall
 * back to the bundled Latin font rather than crashing the whole image.
 */
const PRETENDARD_OTF =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf";

let cached: ArrayBuffer | null | undefined;

export async function loadKoreanFont(): Promise<ArrayBuffer | null> {
  if (cached !== undefined) return cached;
  try {
    const res = await fetch(PRETENDARD_OTF, {
      // Skip Next's data cache (the 1.5MB file exceeds its 2MB item limit and
      // logs a warning); the module-level `cached` handles warm reuse instead.
      cache: "no-store",
    });
    cached = res.ok ? await res.arrayBuffer() : null;
  } catch {
    cached = null;
  }
  return cached;
}
