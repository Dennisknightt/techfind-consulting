/**
 * POST /api/audit/check
 *
 * Lightweight pre-flight called by the client before the audit animation
 * starts. Checks are read-only (counters are NOT incremented here —
 * enforcement with increment happens at /api/leads when the lead is saved).
 *
 * Checks performed:
 *   1. Payload size
 *   2. Honeypot field
 *   3. Submission timing (< 3 s → likely bot)
 *   4. Cloudflare Turnstile (if configured)
 *   5. IP rate-limit  (read-only)
 *   6. Duplicate detection (read-only)
 *   7. Light abuse guard on the check endpoint itself
 */

import { NextRequest, NextResponse } from "next/server";
import { getClientIp, hashIp, hashId } from "@/lib/ip";
import { rateLimit } from "@/lib/ratelimit";
import { dupeKey } from "@/lib/validate";
import { cfg } from "@/lib/config";
import { trackEvent } from "@/lib/metrics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ─── Turnstile verification ─────────────────────────────────────── */

async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  if (!cfg.turnstile.secret) return true;   // not configured — skip
  if (!token)                return false;
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret:   cfg.turnstile.secret,
          response: token,
        }),
      }
    );
    const data = await res.json();
    return data.success === true;
  } catch {
    // Turnstile API unreachable — fail open to avoid blocking real users
    return true;
  }
}

/* ─── Route handler ──────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    // 1. Payload size
    const cl = req.headers.get("content-length");
    if (cl && parseInt(cl, 10) > cfg.payload.maxBytes) {
      trackEvent("blocked_payload");
      return NextResponse.json(
        { blocked: true, message: "Request too large" },
        { status: 413 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ blocked: true, message: "Invalid request" }, { status: 400 });
    }

    const { email, websiteUrl, _hp, _token, _loadedAt } =
      body as Record<string, unknown>;

    // 2. Honeypot — silently pretend success so bots don't know they were caught
    if (typeof _hp === "string" && _hp.length > 0) {
      trackEvent("blocked_bot");
      return NextResponse.json({ ok: true });
    }

    // 3. Timing check — forms filled in under 3 s are almost certainly bots
    if (typeof _loadedAt === "number") {
      const elapsed = Date.now() - _loadedAt;
      if (elapsed < 3_000) {
        trackEvent("blocked_bot");
        return NextResponse.json({ ok: true }); // silent
      }
    }

    // 4. Turnstile (optional)
    if (cfg.turnstile.secret) {
      const valid = await verifyTurnstile(
        typeof _token === "string" ? _token : undefined
      );
      if (!valid) {
        trackEvent("blocked_bot");
        return NextResponse.json(
          {
            blocked: true,
            code:    "BOT",
            message: "Security verification failed. Please refresh and try again.",
          },
          { status: 403 }
        );
      }
    }

    const ip       = getClientIp(req);
    const ipHash   = hashIp(ip);

    // 5. Abuse guard on /check endpoint itself (20 calls / window)
    const checkGuard = await rateLimit(
      `check:${ipHash}`,
      cfg.precheck.limit,
      cfg.precheck.windowMs,
    );
    if (!checkGuard.allowed) {
      trackEvent("blocked_ip");
      return NextResponse.json(
        {
          blocked: true,
          code:    "RATE_LIMIT",
          message: "You've made several requests recently. Please try again shortly.",
          resetMs: checkGuard.resetMs,
        },
        { status: 429 }
      );
    }

    // 6. IP rate-limit — read-only preview (do not increment)
    const ipCheck = await rateLimit(
      `ip:${ipHash}`,
      cfg.form.limit,
      cfg.form.windowMs,
      { increment: false },
    );
    if (!ipCheck.allowed) {
      trackEvent("blocked_ip");
      return NextResponse.json(
        {
          blocked: true,
          code:    "RATE_LIMIT",
          message: "You've made several requests recently. Please try again shortly.",
          resetMs: ipCheck.resetMs,
        },
        { status: 429 }
      );
    }

    // 7. Duplicate check — read-only preview
    if (typeof email === "string" && typeof websiteUrl === "string" && email && websiteUrl) {
      const dk       = dupeKey(email, websiteUrl);
      const dupeCheck = await rateLimit(
        `dupe:${dk}`,
        1,
        cfg.duplicate.windowMs,
        { increment: false },
      );
      if (!dupeCheck.allowed) {
        trackEvent("blocked_duplicate");
        return NextResponse.json(
          {
            blocked: true,
            code:    "DUPLICATE",
            message: "We already received this request. You don't need to submit it again.",
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("[audit/check] unexpected error:", err instanceof Error ? err.message : err);
    // Fail open — never block genuine users because of a server error
    return NextResponse.json({ ok: true });
  }
}
