/**
 * /api/leads
 *
 * POST — create a lead from the audit + qualification flow.
 *         Full enforcement: validates, rate-limits, deduplicates, then saves.
 *
 * GET  — list all leads (admin only; requires a logged-in SUPER_ADMIN session).
 *
 * Protection pipeline (POST):
 *   1. Payload size guard
 *   2. Input validation + sanitisation
 *   3. Honeypot check
 *   4. IP rate limit   (increments counter)
 *   5. Email identity rate limit (increments counter)
 *   6. Phone identity rate limit (increments counter, if phone provided)
 *   7. Duplicate detection (increments duplicate key)
 *   8. Save lead
 *   9. Log safe metrics
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllLeads, saveLead, gradeFromScore, stageFromQualification } from "@/lib/store";
import type { Lead } from "@/lib/store";
import { getClientIp, hashIp, hashId } from "@/lib/ip";
import { rateLimit } from "@/lib/ratelimit";
import { validateAuditPayload, dupeKey } from "@/lib/validate";
import { cfg } from "@/lib/config";
import { requireAdminUser } from "@/lib/adminAuth";
import { trackEvent } from "@/lib/metrics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ─── GET /api/leads ─────────────────────────────────────────────── */

export async function GET() {
  if (!(await requireAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ leads: getAllLeads() });
}

/* ─── POST /api/leads ────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  const ip     = getClientIp(req);
  const ipHash = hashIp(ip);

  try {
    /* 1. Payload size ─────────────────────────────────────────────── */
    const cl = req.headers.get("content-length");
    if (cl && parseInt(cl, 10) > cfg.payload.maxBytes) {
      trackEvent("blocked_payload");
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const rawBody = await req.json().catch(() => null);
    if (!rawBody || typeof rawBody !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    /* 2. Input validation ─────────────────────────────────────────── */
    const validation = validateAuditPayload(rawBody);
    if (!validation.ok) {
      trackEvent("blocked_validation");
      return NextResponse.json({ error: validation.error }, { status: 422 });
    }
    const data = validation.data;

    /* 3. Honeypot ─────────────────────────────────────────────────── */
    const b   = rawBody as Record<string, unknown>;
    const _hp = typeof b._hp === "string" ? b._hp : "";
    if (_hp.length > 0) {
      trackEvent("blocked_bot");
      // Silent acceptance — bot thinks the request succeeded
      return NextResponse.json({ lead: { id: "ok" } }, { status: 201 });
    }

    /* 4. IP rate limit ────────────────────────────────────────────── */
    const ipResult = await rateLimit(`ip:${ipHash}`, cfg.form.limit, cfg.form.windowMs);
    if (!ipResult.allowed) {
      trackEvent("blocked_ip");
      return NextResponse.json(
        { error: "You've made several requests recently. Please try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After":        String(Math.ceil(ipResult.resetMs / 1000)),
            "X-RateLimit-Limit":  String(cfg.form.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    /* 5. Email identity rate limit ────────────────────────────────── */
    const emailHash   = hashId(data.email);
    const emailResult = await rateLimit(`email:${emailHash}`, cfg.identity.limit, cfg.identity.windowMs);
    if (!emailResult.allowed) {
      trackEvent("blocked_identity");
      return NextResponse.json(
        { error: "You've made several requests recently. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(emailResult.resetMs / 1000)) } }
      );
    }

    /* 6. Phone identity rate limit (optional) ─────────────────────── */
    if (data.phone) {
      const phoneHash   = hashId(data.phone);
      const phoneResult = await rateLimit(`phone:${phoneHash}`, cfg.identity.limit, cfg.identity.windowMs);
      if (!phoneResult.allowed) {
        trackEvent("blocked_identity");
        return NextResponse.json(
          { error: "You've made several requests recently. Please try again shortly." },
          { status: 429, headers: { "Retry-After": String(Math.ceil(phoneResult.resetMs / 1000)) } }
        );
      }
    }

    /* 7. Duplicate detection ──────────────────────────────────────── */
    const dk         = dupeKey(data.email, data.websiteUrl);
    const dupeResult = await rateLimit(`dupe:${dk}`, 1, cfg.duplicate.windowMs);
    if (!dupeResult.allowed) {
      trackEvent("blocked_duplicate");
      return NextResponse.json(
        { error: "We already received this request. You don't need to submit it again." },
        { status: 409 }
      );
    }

    /* 8. Save lead ────────────────────────────────────────────────── */
    const qualified = Boolean(b.qualified);

    const lead: Lead = {
      id:          `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt:   new Date().toISOString(),

      companyName:  data.companyName,
      websiteUrl:   data.websiteUrl,
      email:        data.email,
      industry:     data.industry,
      country:      data.country,
      phone:        data.phone || undefined,

      // Scores come from the client (computed deterministically; no AI cost)
      overallScore:    Number(b.overallScore)    || 0,
      technicalScore:  Number(b.technicalScore)  || 0,
      entityScore:     Number(b.entityScore)     || 0,
      authorityScore:  Number(b.authorityScore)  || 0,
      aiReadinessScore: Number(b.aiReadinessScore) || 0,
      opportunities:   Number(b.opportunities)   || 0,

      // Qualification answers (validated as strings, no enum check needed here
      // because the frontend already constrains the options)
      isDecisionMaker:  typeof b.isDecisionMaker  === "string" ? b.isDecisionMaker  : undefined,
      budget:           typeof b.budget            === "string" ? b.budget            : undefined,
      currentMarketing: typeof b.currentMarketing  === "string" ? b.currentMarketing  : undefined,
      timeline:         typeof b.timeline          === "string" ? b.timeline          : undefined,
      revenue:          typeof b.revenue           === "string" ? b.revenue           : undefined,
      qualified,

      grade: gradeFromScore(Number(b.overallScore) || 0),
      stage: stageFromQualification(qualified, typeof b.budget === "string" ? b.budget : undefined),
    };

    saveLead(lead);

    /* 9. Observability — no PII in logs ───────────────────────────── */
    trackEvent("submissions_ok");
    console.info(
      `[leads] saved ${lead.id} | ip=${ipHash.slice(0, 8)}… | ` +
      `industry=${data.industry} | country=${data.country} | qualified=${qualified}`
    );

    return NextResponse.json(
      { lead: { id: lead.id, grade: lead.grade, stage: lead.stage } },
      { status: 201 }
    );

  } catch (err) {
    trackEvent("errors");
    console.error("[leads] POST error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
