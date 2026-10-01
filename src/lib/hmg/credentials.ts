/**
 * Credibility content. ONLY verified facts are published.
 *
 * Every optional field below is empty until HMG supplies it in writing. Empty
 * fields — and any section that depends on them — are hidden automatically.
 * Do not add clients, testimonials, registrations, qualifications or numbers
 * that HMG has not confirmed.
 */

/** Sources: HMG's public LinkedIn company page and its previously published website. */
export const VERIFIED = {
  founded: 2020,
  headquarters: "Nairobi, Kenya",
  office: "Akai Plaza, Garden Estate Road, Nairobi",
  audiences: ["Individuals", "Startups", "SMEs", "Corporations", "NGOs"],
  serviceLines: 6,
  /** Supplied by HMG. */
  reach: "Kenya and Africa",
} as const;

export interface TeamMember {
  name: string;
  role: string;
  expertise?: string; // area of expertise
  profile: string; // 1–2 sentences
  qualification?: string; // verified only, e.g. "CPA (K)"
  photo?: string; // /public path, square, ≥ 600px, e.g. /hmg/team/jane-doe.jpg
  linkedin?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  permissionOnFile: true; // written consent to publish is required
}

export const OPTIONAL = {
  /** e.g. { body: "ICPAK", detail: "Registered firm no. …" } */
  registrations: [] as { body: string; detail: string }[],
  /** e.g. "Member, Kenya Private Sector Alliance" */
  affiliations: [] as string[],
  /** e.g. "40+ years combined" — only if HMG confirms the figure. */
  combinedExperience: null as string | null,
  /** Sectors HMG actively serves. */
  industries: [] as string[],
  /** e.g. "Kenya and Uganda" — only where HMG has active engagements. */
  geographicReach: null as string | null,
  /** Verified client or engagement numbers, e.g. { label: "Clients served", value: "120+" }. */
  numbers: [] as { label: string; value: string }[],
  testimonials: [] as Testimonial[],
  team: [] as TeamMember[],
  /** Real photography (HMG consultants, reviews, work settings) — with permission. */
  photos: [] as { src: string; alt: string; caption?: string }[],
};

/**
 * Client-approved case studies only. Use anonymous sector-based descriptions
 * where the client has not agreed to be named. Never invent figures.
 * Sections showing case studies stay hidden while this list is empty.
 */
export interface CaseStudy {
  id: string;
  sector: string; // e.g. "Nairobi-based logistics SME"
  service: string; // service slug
  challenge: string;
  did: string[];
  changed: string[];
  before: string; // one-line "before" state
  after: string; // one-line "after" state
  approvedByClient: true;
}
export const CASE_STUDIES: CaseStudy[] = [];

/**
 * Regulated-service authorisations. These switch public wording between
 * "we do it" and "we prepare you / coordinate with the licensed party".
 * HMG TO CONFIRM each one before setting it to true.
 */
export const AUTHORISATIONS = {
  /** Firm holds an ICPAK practising licence to sign statutory audits and formal assurance reports. */
  licensedAuditPractice: false,
  /** HMG (or its staff) is a KRA-licensed tax agent able to represent clients in objections/disputes. */
  licensedTaxAgent: false,
};
