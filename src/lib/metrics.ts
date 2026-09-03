/**
 * Lightweight in-memory metrics.
 *
 * Counters are keyed by "{event}:{YYYY-MM-DD}" so each day starts fresh.
 * They reset on cold starts — for persistent metrics extend this to use
 * Vercel KV (same creds as the rate limiter).
 *
 * The admin can read all counters via GET /api/metrics.
 */

export type MetricEvent =
  | "submissions_ok"
  | "blocked_ip"
  | "blocked_identity"
  | "blocked_duplicate"
  | "blocked_bot"
  | "blocked_payload"
  | "blocked_validation"
  | "claude_requests"
  | "claude_blocked_ip"
  | "claude_blocked_global"
  | "errors";

declare global {
  var __metrics: Record<string, number> | undefined;
}

function store(): Record<string, number> {
  if (!globalThis.__metrics) globalThis.__metrics = {};
  return globalThis.__metrics;
}

function todayKey(event: MetricEvent): string {
  return `${event}:${new Date().toISOString().slice(0, 10)}`;
}

export function trackEvent(event: MetricEvent, n = 1): void {
  const s = store();
  const k = todayKey(event);
  s[k] = (s[k] ?? 0) + n;
}

export function getMetrics(): Record<string, number> {
  return { ...store() };
}
