/**
 * Fixed-window rate limiter.
 *
 * Storage backends (tried in order):
 *  1. Upstash / Vercel KV  — set KV_REST_API_URL + KV_REST_API_TOKEN
 *     (Vercel KV auto-injects these when you connect a KV database)
 *  2. In-memory globalThis  — works for dev and single-instance deploys;
 *     NOT shared across Vercel function instances. A warning is logged
 *     in production when KV is absent.
 *
 * Window key: rl:{namespace}:{bucket}
 *   bucket = Math.floor(Date.now() / windowMs)
 * Each key expires at the end of its window.
 */

export interface RateLimitResult {
  allowed:   boolean;
  count:     number;
  remaining: number;
  resetMs:   number;  // ms until the current window expires
}

/* ─── In-memory fallback ──────────────────────────────────────────── */

declare global {
  var __rl: Map<string, { count: number; exp: number }> | undefined;
}

function memStore(): Map<string, { count: number; exp: number }> {
  if (!globalThis.__rl) globalThis.__rl = new Map();
  return globalThis.__rl;
}

function memOp(
  key: string,
  limit: number,
  windowMs: number,
  increment: boolean,
): RateLimitResult {
  const store  = memStore();
  const now    = Date.now();
  const bucket = Math.floor(now / windowMs);
  const fk     = `${key}:${bucket}`;
  const exp    = (bucket + 1) * windowMs;

  // Lazy GC — purge expired keys ~0.1 % of calls
  if (Math.random() < 0.001) {
    for (const [k, v] of store) if (v.exp < now) store.delete(k);
  }

  const entry    = store.get(fk) ?? { count: 0, exp };
  const newCount = increment ? entry.count + 1 : entry.count;
  if (increment) store.set(fk, { count: newCount, exp });

  return {
    allowed:   newCount <= limit,
    count:     newCount,
    remaining: Math.max(0, limit - newCount),
    resetMs:   exp - now,
  };
}

/* ─── Upstash / Vercel KV REST ────────────────────────────────────── */

function kvConfig(): { url: string; token: string } | null {
  const url   = process.env.KV_REST_API_URL   ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return { url, token };
  return null;
}

async function kvIncr(key: string, ttlSec: number): Promise<number> {
  const kv = kvConfig()!;
  const res = await fetch(`${kv.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization:  `Bearer ${kv.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR",   key],
      ["EXPIRE", key, ttlSec, "NX"],  // NX = only set if not already set
    ]),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`KV pipeline error: ${res.status}`);
  const data = await res.json();
  return (data[0]?.result as number) ?? 0;
}

async function kvGet(key: string): Promise<number> {
  const kv = kvConfig()!;
  const res = await fetch(`${kv.url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${kv.token}` },
    cache:   "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return parseInt(String(data.result ?? "0"), 10) || 0;
}

/* ─── Public API ──────────────────────────────────────────────────── */

/**
 * Check (and optionally increment) a rate-limit counter.
 *
 * @param namespace  Unique string key, e.g. "ip:abc123" or "email:def456"
 * @param limit      Max allowed hits in the window
 * @param windowMs   Window size in milliseconds
 * @param increment  true (default) = check + count this call
 *                   false = read-only check, do not increment
 */
export async function rateLimit(
  namespace: string,
  limit: number,
  windowMs: number,
  { increment = true }: { increment?: boolean } = {},
): Promise<RateLimitResult> {
  const now    = Date.now();
  const bucket = Math.floor(now / windowMs);
  const key    = `rl:${namespace}:${bucket}`;
  const resetMs = (bucket + 1) * windowMs - now;

  if (!kvConfig()) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[ratelimit] KV not configured — using in-memory store. " +
        "Rate limits are NOT shared across Vercel instances. " +
        "Set KV_REST_API_URL + KV_REST_API_TOKEN to enable distributed limiting."
      );
    }
    return memOp(namespace, limit, windowMs, increment);
  }

  try {
    let count: number;
    if (increment) {
      count = await kvIncr(key, Math.ceil(windowMs / 1000));
    } else {
      count = await kvGet(key);
    }
    return {
      allowed:   count <= limit,
      count,
      remaining: Math.max(0, limit - count),
      resetMs,
    };
  } catch (err) {
    // KV unavailable — fail open so genuine users aren't blocked
    console.error("[ratelimit] KV error, failing open:", err instanceof Error ? err.message : err);
    return { allowed: true, count: 0, remaining: limit, resetMs };
  }
}
