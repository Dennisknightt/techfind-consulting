import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/hmg/content";
import { SITE } from "@/lib/hmg/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE.url}/hmg`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...ARTICLES.map((a) => ({ url: `${SITE.url}/hmg/insights/${a.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${SITE.url}/hmg/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
