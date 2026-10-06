import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

// The three pages people read. No lastModified: Google uses it only when it is always accurate, and a build date
// is not. No priority or changeFrequency: Google ignores both.
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/method", "/view"].map((path) => ({ url: new URL(path, SITE_URL).href }));
}
