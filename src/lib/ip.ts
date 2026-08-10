import { NextRequest } from "next/server";
import { createHash } from "crypto";

/**
 * Trusted proxy headers in priority order.
 * We never blindly trust x-forwarded-for because it can be spoofed when
 * the request is not coming through a known reverse proxy.
 */
const TRUSTED_HEADERS = [
  "cf-connecting-ip",        // Cloudflare — single value, already unwrapped
  "x-real-ip",               // Nginx / common load balancers
  "x-vercel-forwarded-for",  // Vercel edge — original client IP
] as const;

/** Extract the real client IP from trusted headers only. */
export function getClientIp(req: NextRequest): string {
  for (const header of TRUSTED_HEADERS) {
    const value = req.headers.get(header);
    if (value) return value.split(",")[0].trim();
  }
  // x-forwarded-for is last-resort; take the first (leftmost) IP which is
  // the original client when Vercel prepends its own.
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "127.0.0.1";
}

const SALT = process.env.IP_HASH_SALT ?? "techfind-rl-2024";

/**
 * One-way hash the IP so we never persist raw IP addresses in rate-limit
 * keys. The salt prevents rainbow-table reversal.
 */
export function hashIp(ip: string): string {
  return createHash("sha256")
    .update(SALT + ":" + ip)
    .digest("hex")
    .slice(0, 40);
}

/** Generic identifier hash (email, phone). Always lower-cases first. */
export function hashId(value: string): string {
  return createHash("sha256")
    .update(SALT + ":" + value.toLowerCase().trim())
    .digest("hex")
    .slice(0, 40);
}
