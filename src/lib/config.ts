/**
 * Centralised rate-limit and security configuration.
 * Every numeric limit is read from an environment variable so
 * you can tune them without touching code.
 */

function envInt(key: string, fallback: number): number {
  const v = process.env[key];
  if (!v) return fallback;
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const cfg = {
  /** Public form: max submissions per IP */
  form: {
    limit:    envInt("FORM_RATE_LIMIT",            5),
    windowMs: envInt("FORM_RATE_WINDOW_MINUTES",  10) * 60_000,
  },

  /** Per-email / per-phone identity limit */
  identity: {
    limit:    envInt("IDENTITY_RATE_LIMIT",           3),
    windowMs: envInt("IDENTITY_RATE_WINDOW_MINUTES", 60) * 60_000,
  },

  /** Lightweight pre-check endpoint abuse guard */
  precheck: {
    limit:    20,
    windowMs: envInt("FORM_RATE_WINDOW_MINUTES", 10) * 60_000,
  },

  /** Claude / AI endpoint limits (framework for future use) */
  claude: {
    ipLimit:      envInt("CLAUDE_IP_RATE_LIMIT",             3),
    ipWindowMs:   envInt("CLAUDE_IP_RATE_WINDOW_MINUTES",   10) * 60_000,
    globalLimit:  envInt("CLAUDE_GLOBAL_RATE_LIMIT",       500),
    globalWindowMs: envInt("CLAUDE_GLOBAL_RATE_WINDOW_MINUTES", 60) * 60_000,
  },

  /** Image analysis limits (framework for future use) */
  images: {
    ipLimit:          envInt("IMAGE_RATE_LIMIT",            5),
    maxPerSubmission: envInt("MAX_IMAGES_PER_SUBMISSION",   3),
    maxSizeBytes:     5 * 1024 * 1024,  // 5 MB hard cap
    allowedTypes:     ["image/jpeg", "image/png", "image/webp", "image/gif"] as readonly string[],
  },

  /** Duplicate-submission window (not env-configurable — intentional) */
  duplicate: {
    windowMs: 10 * 60_000,
  },

  /** Maximum accepted request body */
  payload: {
    maxBytes: 50 * 1024,  // 50 KB
  },

  /** Cloudflare Turnstile (optional bot protection) */
  turnstile: {
    siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
    secret:  process.env.TURNSTILE_SECRET_KEY ?? "",
  },

  /** Admin endpoints */
  admin: {
    secret:  process.env.ADMIN_SECRET ?? "",
    metricsSecret: process.env.METRICS_SECRET ?? "",
  },
} as const;
