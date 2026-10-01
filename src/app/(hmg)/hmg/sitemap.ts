import type { MetadataRoute } from "next";
import { ARTICLES, SERVICES } from "@/lib/hmg/content";
import { abs, ROUTES } from "@/lib/hmg/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({ url: abs(path), lastModified: now, changeFrequency, priority });
  return [
    page(ROUTES.home, 1, "weekly"),
    page(ROUTES.services, 0.9),
    ...SERVICES.map((s) => page(ROUTES.service(s.slug), 0.85)),
    page(ROUTES.about, 0.7),
    page(ROUTES.contact, 0.8),
    page(ROUTES.insights, 0.7, "weekly"),
    ...ARTICLES.map((a) => ({ url: abs(ROUTES.article(a.slug)), lastModified: new Date(`${a.published}T00:00:00Z`), changeFrequency: "yearly" as const, priority: 0.6 })),
    page(ROUTES.privacy, 0.2, "yearly"),
  ];
}
