import "server-only";
import type { PaymentProvider, ChargeInput, ChargeResult, StatusResult, RefundInput, ProviderStatus } from "./provider";

/**
 * Direct Safaricom Daraja integration — M-Pesa STK push ("Lipa na M-Pesa
 * Online") without an aggregator in between. M-Pesa only; Daraja has no
 * card rails, so `supportedMethods` is deliberately just ["MPESA"] and the
 * checkout UI (which filters on this) never offers Card while this
 * provider is active.
 *
 * Unlike IntaSend's webhook, Safaricom doesn't sign or otherwise
 * authenticate its STK callback — the same defense the IntaSend webhook
 * documents applies here too and matters more, not less: the callback's
 * claimed result is only ever used to identify *which* Payment to
 * re-check, never to credit it directly. `checkStatus` always re-verifies
 * with Safaricom's own STK query endpoint before anything is trusted. See
 * /docs/PAYMENTS.md.
 */

const SANDBOX_HOST = "https://sandbox.safaricom.co.ke";
const PRODUCTION_HOST = "https://api.safaricom.co.ke";

function host(): string {
  const env = process.env.MPESA_ENV ?? (process.env.NODE_ENV === "production" ? "production" : "sandbox");
  return env === "production" ? PRODUCTION_HOST : SANDBOX_HOST;
}

function config() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  if (!consumerKey || !consumerSecret || !shortcode || !passkey) {
    throw new Error("Daraja is not configured (missing consumer key/secret, shortcode, or passkey)");
  }
  return { consumerKey, consumerSecret, shortcode, passkey };
}

/** 2547XXXXXXXX / 2541XXXXXXXX — the only phone shape Daraja's STK endpoint accepts. */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (/^254[71]\d{8}$/.test(digits)) return digits;
  if (/^0[71]\d{8}$/.test(digits)) return `254${digits.slice(1)}`;
  if (/^[71]\d{8}$/.test(digits)) return `254${digits}`;
  throw new Error("Enter a valid Safaricom M-Pesa number");
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

declare global {
  // eslint-disable-next-line no-var
  var __darajaTokenCache: { token: string; expiresAt: number } | undefined;
}

/** Cached in-memory per warm serverless instance — Daraja tokens are valid ~1 hour, no need to fetch one per request. */
async function getAccessToken(): Promise<string> {
  const cached = globalThis.__darajaTokenCache;
  if (cached && cached.expiresAt > Date.now()) return cached.token;

  const { consumerKey, consumerSecret } = config();
  const basic = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const res = await fetch(`${host()}/oauth/v1/generate?grant_type=client_credentials`, {
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

async function darajaFetch(path: string, body: unknown): Promise<Record<string, unknown>> {
  const token = await getAccessToken();
  const res = await fetch(`${host()}${path}`, {
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

/** Maps an STK query's ResultCode to our status vocabulary — never guesses SUCCESSFUL. */
function mapResultCode(resultCode: number | undefined): ProviderStatus {
  if (resultCode === 0) return "SUCCESSFUL";
  if (resultCode === undefined) return "PENDING";
  if (resultCode === 1032) return "CANCELLED"; // cancelled by user on the phone
  if (resultCode === 1037) return "CANCELLED"; // no response / timed out waiting for PIN
  return "FAILED"; // any other explicit non-zero result (e.g. 1 = insufficient funds)
}

export const darajaProvider: PaymentProvider = {
  name: "DARAJA",
  supportedMethods: ["MPESA"],

  async createCharge(input: ChargeInput): Promise<ChargeResult> {
    if (input.method !== "MPESA") throw new Error("Daraja only supports M-Pesa");
    if (!input.phone) throw new Error("Phone number is required for M-Pesa payments");

    const { shortcode, passkey } = config();
    const ts = timestamp();
    const password = Buffer.from(`${shortcode}${passkey}${ts}`).toString("base64");
    const phone = normalizePhone(input.phone);
    const callbackBase = process.env.NEXT_PUBLIC_APP_URL;
    if (!callbackBase) throw new Error("NEXT_PUBLIC_APP_URL must be set for Daraja's callback URL");

    const raw = await darajaFetch("/mpesa/stkpush/v1/processrequest", {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: ts,
      TransactionType: process.env.MPESA_TRANSACTION_TYPE ?? "CustomerPayBillOnline",
      Amount: Math.round(input.amount), // Daraja rejects decimal amounts
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: `${callbackBase}/api/webhooks/payments/daraja`,
      AccountReference: input.reference.slice(-12).toUpperCase() || "TECHFIND",
      TransactionDesc: (input.name ? `Payment - ${input.name}` : "Techfind Payment").slice(0, 100),
    });

    if (String(raw.ResponseCode) !== "0") {
      throw new Error((raw.ResponseDescription as string) ?? (raw.CustomerMessage as string) ?? "Daraja declined the STK push request");
    }
    const gatewayReference = String(raw.CheckoutRequestID ?? "");
    if (!gatewayReference) throw new Error("Daraja response had no CheckoutRequestID");
    return { gatewayReference, status: "PENDING", raw };
  },

  async checkStatus(gatewayReference: string): Promise<StatusResult> {
    const { shortcode, passkey } = config();
    const ts = timestamp();
    const password = Buffer.from(`${shortcode}${passkey}${ts}`).toString("base64");

    let raw: Record<string, unknown>;
    try {
      raw = await darajaFetch("/mpesa/stkpushquery/v1/query", {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: ts,
        CheckoutRequestID: gatewayReference,
      });
    } catch (err) {
      // Querying before the customer has responded (or right after the
      // prompt was sent) returns an error rather than a ResultCode — that's
      // "still waiting," not a failure, so it maps to PENDING rather than
      // propagating as an error that would mark the payment FAILED.
      const message = err instanceof Error ? err.message.toLowerCase() : "";
      if (message.includes("processed") || message.includes("pending") || message.includes("being processed")) {
        return { status: "PENDING", raw: { error: err instanceof Error ? err.message : String(err) } };
      }
      throw err;
    }

    const resultCode = raw.ResultCode !== undefined ? Number(raw.ResultCode) : undefined;
    return { status: mapResultCode(resultCode), raw };
  },

  async refund(_input: RefundInput) {
    // Daraja's reversal API needs a separate initiator identity (a security
    // credential encrypted against Safaricom's public certificate) that
    // nothing in this app currently provisions, and no caller invokes this
    // method today — better to fail loudly than to silently no-op or
    // (worse) report a fake success on a real M-Pesa transaction.
    throw new Error("Daraja refunds aren't supported yet — reverse this transaction from the Safaricom/M-Pesa Business portal directly.");
  },
};
