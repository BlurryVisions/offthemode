// The public origin, in one place for the app (lib/content.ts) and the content build (scripts/build-content.mjs),
// so canonical links, share tags, robots.txt and the sitemap all move together when the domain does.
/** NEXT_PUBLIC_SITE_URL, else Vercel's production domain, else local dev. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
