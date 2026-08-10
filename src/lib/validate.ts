import { createHash } from "crypto";

/* ─── Allowed values ───────────────────────────────────────────────── */

const ALLOWED_INDUSTRIES = new Set([
  "HVAC & Heating","Roofing","Plumbing","Electrical","Solar Energy",
  "Landscaping","Construction","Home Services","Law Firm","Medical Clinic",
  "Dental Practice","Accounting","Financial Advisory","IT Services",
  "Marketing Agency","Real Estate","Restaurant / Food","E-commerce","Other",
]);

const ALLOWED_COUNTRIES = new Set([
  "Kenya","Uganda","Tanzania","Nigeria","South Africa","Ethiopia",
  "United Kingdom","Germany","France","Netherlands","UAE","Singapore",
  "India","Brazil","Mexico","Other",
]);

/* ─── Helpers ──────────────────────────────────────────────────────── */

/** Strip leading/trailing whitespace, cap length, remove < > to block XSS */
function sanitize(v: unknown, maxLen = 200): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, maxLen).replace(/[<>]/g, "");
}

function isValidEmail(e: string): boolean {
  return (
    e.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)
  );
}

function normaliseUrl(raw: string): string {
  const u = raw.startsWith("http") ? raw : `https://${raw}`;
  try {
    const p = new URL(u);
    // Return scheme + host + path, strip query/fragment (not needed for our purposes)
    return (p.origin + p.pathname).replace(/\/$/, "");
  } catch {
    return u;
  }
}

/* ─── Exported types ───────────────────────────────────────────────── */

export interface ValidatedAuditPayload {
  websiteUrl:  string;
  companyName: string;
  email:       string;
  industry:    string;
  country:     string;
  phone:       string;
  /** Cloudflare Turnstile response token (optional) */
  _token?:    string;
  /** Unix ms timestamp when the form page was loaded (timing check) */
  _loadedAt?: number;
}

type ValidationOk  = { ok: true;  data: ValidatedAuditPayload };
type ValidationErr = { ok: false; error: string };

/* ─── Main validator ───────────────────────────────────────────────── */

export function validateAuditPayload(body: unknown): ValidationOk | ValidationErr {
  if (typeof body !== "object" || body === null)
    return { ok: false, error: "Invalid request" };

  const b = body as Record<string, unknown>;

  // Website URL
  const websiteUrl = sanitize(b.websiteUrl, 500);
  if (!websiteUrl) return { ok: false, error: "Website URL is required" };
  if (!/^(https?:\/\/)?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+/.test(websiteUrl))
    return { ok: false, error: "Enter a valid website URL" };

  // Company name
  const companyName = sanitize(b.companyName, 100);
  if (companyName.length < 2) return { ok: false, error: "Company name is required" };

  // Email
  const email = sanitize(b.email, 254).toLowerCase();
  if (!isValidEmail(email)) return { ok: false, error: "A valid email address is required" };

  // Industry — must be from the allowed list (prevents enum injection)
  const industry = sanitize(b.industry, 60);
  if (!ALLOWED_INDUSTRIES.has(industry)) return { ok: false, error: "Select a valid industry" };

  // Country — must be from the allowed list
  const country = sanitize(b.country, 60);
  if (!ALLOWED_COUNTRIES.has(country)) return { ok: false, error: "Select a valid country" };

  // Phone — optional; if present, basic sanity check
  const phone = sanitize(b.phone ?? "", 30);
  if (phone && !/^[+0-9\s\-().]{7,25}$/.test(phone))
    return { ok: false, error: "Enter a valid phone number" };

  // Internal fields — safe extraction
  const _token   = typeof b._token    === "string" ? b._token.slice(0, 2048) : undefined;
  const _loadedAt = typeof b._loadedAt === "number" ? b._loadedAt            : undefined;

  return {
    ok: true,
    data: {
      websiteUrl:  normaliseUrl(websiteUrl),
      companyName,
      email,
      industry,
      country,
      phone,
      _token,
      _loadedAt,
    },
  };
}

/**
 * Stable hash key for duplicate detection.
 * Combining normalised email + URL means re-submitting the exact same
 * audit within the window is detected as a duplicate.
 */
export function dupeKey(email: string, websiteUrl: string): string {
  return createHash("sha256")
    .update(email.toLowerCase().trim() + "|" + websiteUrl.toLowerCase().trim())
    .digest("hex")
    .slice(0, 40);
}
