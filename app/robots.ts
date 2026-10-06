import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

// The AI-crawler choice and its reason: .offthemode/DECISIONS.md D-012, proposed and waiting for the author's go.
// Until then one group lets every crawler read every page, as when the site had no robots.txt: search engines, the AI
// search bots (OAI-SearchBot, Claude-SearchBot, PerplexityBot) and the training ones (GPTBot, ClaudeBot,
// Google-Extended, Applebot-Extended, CCBot) alike. To keep the site out of training, give each training token its
// own group with disallow: "/" (one group per token, as each company's crawler page asks), and update D-012.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
