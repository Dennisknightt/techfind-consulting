import { z } from "zod";

/* ── Qualification flow options (shared by the client flow and the API) ── */
export const NEEDS = [
  { id: "tax", label: "Tax and KRA", service: "tax-kra-advisory", team: "Tax & KRA" },
  { id: "accounting", label: "Accounting and bookkeeping", service: "accounting-bookkeeping", team: "Accounting" },
  { id: "audit", label: "Audit and assurance", service: "audit-assurance", team: "Audit & Assurance" },
  { id: "advisory", label: "Financial advisory", service: "financial-advisory", team: "Advisory" },
  { id: "payroll", label: "Payroll", service: "payroll-management", team: "Payroll" },
  { id: "health", label: "Tax health check", service: "tax-health-checks", team: "Tax & KRA" },
  { id: "urgent", label: "KRA notice or urgent issue", service: "tax-kra-advisory", team: "Tax & KRA" },
  { id: "unsure", label: "Not sure yet", service: "", team: "Client intake" },
] as const;

export const PROFILES = [
  { id: "individual", label: "Individual" },
  { id: "startup", label: "Startup" },
  { id: "sme", label: "SME" },
  { id: "corporation", label: "Corporation" },
  { id: "ngo", label: "NGO" },
  { id: "other", label: "Other organisation" },
] as const;

export const SITUATION_OPTS = [
  { id: "kra", label: "We have a KRA deadline or notice" },
  { id: "books", label: "Our books are behind" },
  { id: "compliance", label: "We need compliance support" },
  { id: "audit", label: "We are preparing for an audit" },
  { id: "cash", label: "We need cash-flow visibility" },
  { id: "payroll", label: "We have payroll challenges" },
  { id: "growth", label: "We are growing or expanding" },
  { id: "ongoing", label: "We need ongoing financial support" },
  { id: "other", label: "Something else" },
] as const;

export const URGENCY = [
  { id: "48h", label: "Within 48 hours", followUpBusinessDays: 0 },
  { id: "week", label: "This week", followUpBusinessDays: 1 },
  { id: "2weeks", label: "Within two weeks", followUpBusinessDays: 2 },
  { id: "month", label: "This month", followUpBusinessDays: 3 },
  { id: "exploring", label: "Just exploring", followUpBusinessDays: 5 },
] as const;

export const CHANNELS = [
  { id: "phone", label: "Phone" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Email" },
] as const;

const ids = <T extends readonly { id: string }[]>(a: T) => a.map((x) => x.id) as unknown as [T[number]["id"], ...T[number]["id"][]];

/** Kenyan numbers (07…/01…, 254…, +254…) or international E.164-style (+ and 8–15 digits). */
export function normalisePhone(raw: string) {
  return raw.replace(/[\s().-]/g, "");
}
export function isValidPhone(raw: string) {
  return /^(?:0[17]\d{8}|\+?254[17]\d{8}|\+[1-9]\d{7,14})$/.test(normalisePhone(raw));
}

export const qualifySchema = z
  .object({
    needs: z.array(z.enum(ids(NEEDS))).min(1, "Choose at least one option."),
    profile: z.enum(ids(PROFILES), { message: "Choose the option that fits best." }),
    situation: z.array(z.enum(ids(SITUATION_OPTS))).min(1, "Choose at least one option."),
    other: z.string().trim().max(500).optional().default(""),
    urgency: z.enum(ids(URGENCY), { message: "Choose how urgent this is." }),
    channels: z.array(z.enum(ids(CHANNELS))).min(1, "Choose at least one way to reach you."),
    name: z.string().trim().min(2, "Please enter your full name.").max(100),
    phone: z.string().trim().refine(isValidPhone, "Enter a valid phone number."),
    email: z.union([z.literal(""), z.string().trim().email("Enter a valid email address.")]).optional().default(""),
    company: z.string().trim().max(120).optional().default(""),
    consent: z.literal(true, { message: "Please confirm we may contact you." }),
    website: z.string().optional().default(""), // honeypot
    elapsed: z.number().optional().default(0),
  })
  .superRefine((v, ctx) => {
    if (v.situation.includes("other") && v.other.length < 3) ctx.addIssue({ code: "custom", path: ["other"], message: "Tell us briefly what is happening." });
    if (v.channels.includes("email") && !v.email) ctx.addIssue({ code: "custom", path: ["email"], message: "Add an email address so we can reply by email." });
  });

export type QualifyInput = z.input<typeof qualifySchema>;
export type QualifyData = z.output<typeof qualifySchema>;

export const labelOf = <T extends readonly { id: string; label: string }[]>(list: T, id: string) => list.find((x) => x.id === id)?.label ?? id;
