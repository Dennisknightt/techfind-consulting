/**
 * Single source of truth for HMG Group Africa's identity, contact details and routes.
 * The site is mounted under HMG_BASE; change it (and move the route folder) to
 * serve HMG from a domain root.
 */
export const HMG_BASE = "/hmg";

export const SITE = {
  name: "HMG Group Africa",
  legalName: "HMG Group Africa",
  // Canonical origin. hmggroup.africa currently redirects to an unrelated site,
  // so the live Vercel host is the safe default until the domain is restored.
  url: (process.env.NEXT_PUBLIC_HMG_URL ?? "https://hmg-group-africa.vercel.app").replace(/\/$/, ""),
  tagline: "Financial clarity. Confident growth.",
  positioning: "HMG helps businesses remain compliant, understand their numbers and make confident financial decisions.",
  description:
    "Nairobi-based tax, accounting, audit and advisory firm. HMG helps businesses stay compliant with KRA, understand their numbers and make confident financial decisions.",
  founded: 2020,
  phone: "+254 703 126 677",
  phoneHref: "tel:+254703126677",
  email: "info@hmggroup.africa",
  emailHref: "mailto:info@hmggroup.africa",
  whatsappNumber: "254703126677",
  address: {
    street: "Akai Plaza, Garden Estate Road",
    city: "Nairobi",
    country: "KE",
    line: "Akai Plaza, Garden Estate Road, Nairobi",
  },
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Akai+Plaza+Garden+Estate+Road+Nairobi",
  hours: "Monday–Friday, 8:00 AM–5:00 PM",
  social: {
    // Verified public company page.
    linkedin: "https://www.linkedin.com/company/hmg-group-africa",
    // HMG TO SUPPLY: the official Facebook page URL. Hidden until set.
    facebook: null as string | null,
  },
} as const;

export function whatsappLink(message = "Hello HMG, I would like to discuss my business finances.") {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const ROUTES = {
  home: HMG_BASE,
  about: `${HMG_BASE}/about`,
  services: `${HMG_BASE}/services`,
  service: (slug: string) => `${HMG_BASE}/services/${slug}`,
  insights: `${HMG_BASE}/insights`,
  article: (slug: string) => `${HMG_BASE}/insights/${slug}`,
  contact: `${HMG_BASE}/contact`,
  privacy: `${HMG_BASE}/privacy`,
} as const;

export const CONSULT_HREF = `${ROUTES.contact}#consultation`;

export const NAV = [
  { label: "Home", href: ROUTES.home },
  { label: "About", href: ROUTES.about },
  { label: "Services", href: ROUTES.services },
  { label: "Insights", href: ROUTES.insights },
  { label: "Contact", href: ROUTES.contact },
] as const;

export const abs = (path: string) => `${SITE.url}${path}`;
