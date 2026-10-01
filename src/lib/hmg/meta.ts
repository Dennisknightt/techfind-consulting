import type { Metadata } from "next";
import { SITE } from "./site";

export const OG_IMAGE = { url: "/hmg/og.png", width: 1200, height: 630, alt: "HMG Group Africa — Financial clarity. Confident growth." };

/** Complete per-page metadata (Next replaces, rather than merges, nested openGraph objects). */
export function pageMeta({ title, description, path, absoluteTitle = false, type = "website", publishedTime }: { title: string; description: string; path: string; absoluteTitle?: boolean; type?: "website" | "article"; publishedTime?: string }): Metadata {
  const full = absoluteTitle ? title : `${title} | ${SITE.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { type, url: path, siteName: SITE.name, locale: "en_KE", title: full, description, images: [OG_IMAGE], ...(publishedTime ? { publishedTime, authors: ["HMG Editorial Team"] } : {}) },
    twitter: { card: "summary_large_image", title: full, description, images: [OG_IMAGE.url] },
  };
}
