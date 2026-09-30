/**
 * Single source of truth for HMG Group Africa's identity and contact details.
 * The site is mounted under HMG_BASE; change it (and move the route folder) to
 * serve HMG from a domain root.
 */
export const HMG_BASE = "/hmg";

export const SITE = {
  name: "HMG Group Africa",
  legalName: "HMG Group Africa",
  url: process.env.NEXT_PUBLIC_HMG_URL ?? "https://hmggroup.africa",
  tagline: "Financial clarity. Confident growth.",
  description:
    "Tax, accounting, audit and advisory expertise for businesses building their next chapter across Africa. Nairobi-based, KRA-savvy, personally responsive.",
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
  hours: "Monday–Friday, 8:00 AM–5:00 PM",
  social: {
    linkedin: "https://www.linkedin.com/company/hmg-group-africa",
    facebook: "https://www.facebook.com/hmggroupafrica",
  },
} as const;

export function whatsappLink(message = "Hello HMG, I would like to discuss my business finances.") {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const hmgPath = (hash = "") => `${HMG_BASE}${hash}`;

export const NAV = [
  { label: "Home", href: hmgPath("") },
  { label: "About", href: hmgPath("#about") },
  { label: "Services", href: hmgPath("#services") },
  { label: "Insights", href: hmgPath("#insights") },
  { label: "Contact", href: hmgPath("#contact") },
] as const;

export const CONSULT_HREF = hmgPath("#consultation");
