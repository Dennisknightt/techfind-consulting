import "server-only";

/**
 * Shared low-level Daraja plumbing — OAuth token exchange (cached) and the
 * authenticated POST helper — used by both darajaProvider.ts (STK push,
 * for collecting a payment) and mpesaBalance.ts (the Account Balance
 * query, an organizational lookup rather than a payment). Kept separate so
 * neither of those files needs to know about the other's concerns.
 */

const SANDBOX_HOST = "https://sandbox.safaricom.co.ke";
const PRODUCTION_HOST = "https://api.safaricom.co.ke";

export function darajaHost(): string {
  const env = process.env.MPESA_ENV ?? (process.env.NODE_ENV === "production" ? "production" : "sandbox");
  return env === "production" ? PRODUCTION_HOST : SANDBOX_HOST;
}

export function darajaTimestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

declare global {
  // eslint-disable-next-line no-var
  var __darajaTokenCache: { token: string; expiresAt: number } | undefined;
}

/** Cached in-memory per warm serverless instance — Daraja tokens are valid ~1 hour, no need to fetch one per request. */
export async function getDarajaAccessToken(): Promise<string> {
  const cached = globalThis.__darajaTokenCache;
  if (cached && cached.expiresAt > Date.now()) return cached.token;

  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  if (!consumerKey || !consumerSecret) throw new Error("Daraja is not configured (missing consumer key/secret)");

  const basic = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const res = await fetch(`${darajaHost()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${basic}` },
  });
  if (!res.ok) throw new Error(`Daraja auth failed (${res.status})`);
  const data = (await res.json()) as { access_token?: string; expires_in?: string };
  if (!data.access_token) throw new Error("Daraja auth response had no access_token");

  const expiresInSec = Number(data.expires_in ?? 3599);
  globalThis.__darajaTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (expiresInSec - 60) * 1000, // refresh a minute early
  };
  return data.access_token;
}

export async function darajaFetch(path: string, body: unknown): Promise<Record<string, unknown>> {
  const token = await getDarajaAccessToken();
  const res = await fetch(`${darajaHost()}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const message = (data.errorMessage as string) ?? (data.ResponseDescription as string) ?? `Daraja request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}
