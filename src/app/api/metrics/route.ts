/**
 * GET /api/metrics
 *
 * Admin observability endpoint. Protected by METRICS_SECRET env var.
 *
 * Usage:
 *   curl https://your-site.com/api/metrics \
 *        -H "x-metrics-secret: YOUR_SECRET"
 *
 * Or via query param (for browser testing):
 *   /api/metrics?secret=YOUR_SECRET
 */

import { NextRequest, NextResponse } from "next/server";
import { getMetrics } from "@/lib/metrics";
import { getAllLeads } from "@/lib/store";
import { cfg } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Auth — check header first, then query param
  const provided =
    req.headers.get("x-metrics-secret") ??
    req.nextUrl.searchParams.get("secret") ??
    "";

  const expected = cfg.admin.metricsSecret;
  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Lead counts
  const leads     = getAllLeads();
  const today     = new Date().toISOString().slice(0, 10);
  const todayLeads = leads.filter(l => l.createdAt.startsWith(today));

  // Event counters (keyed by "event:YYYY-MM-DD")
  const events = getMetrics();

  // Pull out today's events for summary
  function todayCount(event: string): number {
    return events[`${event}:${today}`] ?? 0;
  }

  return NextResponse.json({
    date: today,
    leads: {
      total_all_time: leads.length,
      today:          todayLeads.length,
      qualified_today: todayLeads.filter(l => l.qualified).length,
    },
    security: {
      submissions_ok:       todayCount("submissions_ok"),
      blocked_ip:           todayCount("blocked_ip"),
      blocked_identity:     todayCount("blocked_identity"),
      blocked_duplicate:    todayCount("blocked_duplicate"),
      blocked_bot:          todayCount("blocked_bot"),
      blocked_payload:      todayCount("blocked_payload"),
      blocked_validation:   todayCount("blocked_validation"),
    },
    ai: {
      claude_requests:      todayCount("claude_requests"),
      claude_blocked_ip:    todayCount("claude_blocked_ip"),
      claude_blocked_global: todayCount("claude_blocked_global"),
    },
    errors: todayCount("errors"),
    raw_events: events,
    config: {
      form_limit:            cfg.form.limit,
      form_window_min:       cfg.form.windowMs / 60_000,
      identity_limit:        cfg.identity.limit,
      identity_window_min:   cfg.identity.windowMs / 60_000,
      claude_ip_limit:       cfg.claude.ipLimit,
      claude_global_limit:   cfg.claude.globalLimit,
      kv_configured: !!(
        process.env.KV_REST_API_URL ||
        process.env.UPSTASH_REDIS_REST_URL
      ),
      turnstile_configured:  !!cfg.turnstile.secret,
      admin_secret_set:      !!cfg.admin.secret,
    },
  });
}
