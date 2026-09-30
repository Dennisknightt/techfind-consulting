import type { MetadataRoute } from "next";
import { SITE } from "@/lib/hmg/site";

// Root-level robots for the whole deployment: keep the internal OS and API out
// of search results and advertise the HMG sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/app/", "/admin/", "/api/", "/login", "/pay/"] }],
    sitemap: `${SITE.url}/hmg/sitemap.xml`,
  };
}
