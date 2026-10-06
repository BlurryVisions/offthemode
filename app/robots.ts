import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

// Found and quoted, but not used for training (.offthemode/DECISIONS.md D-012, decided 2026-10-07).
// Search engines and the AI search bots (OAI-SearchBot, Claude-SearchBot, Claude-User, PerplexityBot) read everything.
// Each training token gets its own group, as each company's crawler page asks. Google-Extended also controls grounding
// in the Gemini app, so Gemini may not cite the site; Google Search and its AI Overviews follow Googlebot and are unaffected.
const TRAINING = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...TRAINING.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
