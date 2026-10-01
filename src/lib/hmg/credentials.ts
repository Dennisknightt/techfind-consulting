/**
 * Credibility content. ONLY verified facts are published.
 *
 * Everything under PENDING is an empty placeholder for HMG to supply. Sections
 * that depend on it stay hidden on the public site until it is filled in (set
 * NEXT_PUBLIC_HMG_SHOW_PLACEHOLDERS=1 to preview the empty slots while editing).
 * Do not add clients, testimonials, registrations or qualifications that HMG
 * has not provided in writing.
 */

export const SHOW_PLACEHOLDERS = process.env.NEXT_PUBLIC_HMG_SHOW_PLACEHOLDERS === "1";

/** Sources: HMG's public LinkedIn company page and its previously published website. */
export const VERIFIED = {
  founded: 2020,
  headquarters: "Nairobi, Kenya",
  office: "Akai Plaza, Garden Estate Road, Nairobi",
  audiences: ["Individuals", "Startups", "SMEs", "Corporations", "NGOs"],
  values: ["Integrity", "Expertise", "Understanding of Africa’s financial and regulatory terrain"],
  serviceLines: 6,
} as const;

export interface TeamMember {
  name: string;
  role: string;
  profile: string;
  qualification?: string;
  photo?: string; // path under /public, e.g. /hmg/team/jane.jpg (square, ≥ 600px)
  linkedin?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  permissionOnFile: true; // must be true — written consent to publish
}

export const PENDING = {
  /** HMG TO SUPPLY: leadership and consultants (real people, real photos). */
  team: [] as TeamMember[],
  /** HMG TO SUPPLY: e.g. ICPAK firm registration, practising certificates, KRA tax agent licence. */
  registrations: [] as { body: string; detail: string }[],
  /** HMG TO SUPPLY: professional qualifications held by the team (e.g. CPA-K, ACCA). */
  qualifications: [] as string[],
  /** HMG TO SUPPLY: sectors HMG actively serves. */
  industries: [] as string[],
  /** HMG TO SUPPLY: client testimonials with written permission. */
  testimonials: [] as Testimonial[],
  /** HMG TO CONFIRM: whether HMG holds the practising licence required to sign statutory audits in Kenya. */
  signsStatutoryAudits: false,
};
