import "server-only";
import { publicEncrypt, constants } from "crypto";
import { db } from "@/server/db";
import { darajaFetch } from "./darajaClient";

/**
 * M-Pesa Account Balance query (Daraja's `AccountBalance` command) — shows
 * the real balance sitting in Techfind's paybill/till, not a payment. This
 * is a different trust model than STK push: it uses Safaricom's
 * "organization" security scheme (Initiator + SecurityCredential) rather
 * than the Lipa Na M-Pesa passkey, and the result arrives *asynchronously*
 * as a POST to ResultURL — the initial response is just an acknowledgment
 * that the request was accepted, never the balance itself.
 *
 * SecurityCredential = the initiator's password, RSA-encrypted (PKCS#1
 * v1.5) against Safaricom's own public certificate for the target
 * environment (sandbox and production use *different* certificates). That
 * certificate is deliberately NOT hardcoded here — download it directly
 * from your Daraja app (developer.safaricom.co.ke → your app → the
 * relevant environment's certificate) and set MPESA_CERT_PEM to its exact
 * contents. Embedding a certificate we can't independently verify would
 * risk silently producing a SecurityCredential Safaricom rejects, or worse,
 * one that's simply wrong — see /docs/PAYMENTS.md.
 */

function config() {
  const shortcode = process.env.MPESA_SHORTCODE;
  const initiatorName = process.env.MPESA_INITIATOR_NAME;
  const initiatorPassword = process.env.MPESA_INITIATOR_PASSWORD;
  const certPemRaw = process.env.MPESA_CERT_PEM;
  if (!shortcode || !initiatorName || !initiatorPassword || !certPemRaw) {
    throw new Error("M-Pesa balance check is not configured (missing shortcode, initiator name/password, or certificate)");
  }
  // Env var UIs vary on whether a pasted multi-line value keeps real
  // newlines or comes through as literal "\n" — normalize so either works.
  const certPem = certPemRaw.includes("\\n") ? certPemRaw.replace(/\\n/g, "\n") : certPemRaw;
  return { shortcode, initiatorName, initiatorPassword, certPem };
}

function buildSecurityCredential(password: string, certPem: string): string {
  const encrypted = publicEncrypt(
    { key: certPem, padding: constants.RSA_PKCS1_PADDING },
    Buffer.from(password, "utf8")
  );
  return encrypted.toString("base64");
}

const SETTING_KEY = "mpesa_account_balance";

export interface MpesaBalanceState {
  status: "PENDING" | "RECEIVED" | "FAILED";
  requestedAt: string;
  receivedAt?: string;
  balance?: number;
  currency?: string;
  accountName?: string;
  raw?: string;
  resultDesc?: string;
}

export async function getMpesaBalanceState(): Promise<MpesaBalanceState | null> {
  const row = await db.setting.findUnique({ where: { key: SETTING_KEY } });
  if (!row) return null;
  try {
    return JSON.parse(row.value) as MpesaBalanceState;
  } catch {
    return null;
  }
}

async function setMpesaBalanceState(state: MpesaBalanceState, updatedById?: string): Promise<void> {
  await db.setting.upsert({
    where: { key: SETTING_KEY },
    update: { value: JSON.stringify(state), updatedById },
    create: { key: SETTING_KEY, value: JSON.stringify(state), updatedById },
  });
}

/** Kicks off the async balance request. The actual figure lands later via the ResultURL webhook. */
export async function requestAccountBalance(updatedById?: string): Promise<void> {
  const { shortcode, initiatorName, initiatorPassword, certPem } = config();
  const callbackBase = process.env.NEXT_PUBLIC_APP_URL;
  if (!callbackBase) throw new Error("NEXT_PUBLIC_APP_URL must be set for Daraja's callback URLs");

  const securityCredential = buildSecurityCredential(initiatorPassword, certPem);

  const raw = await darajaFetch("/mpesa/accountbalance/v1/query", {
    Initiator: initiatorName,
    SecurityCredential: securityCredential,
    CommandID: "AccountBalance",
    PartyA: shortcode,
    IdentifierType: "4", // shortcode
    Remarks: "Techfind balance check",
    QueueTimeOutURL: `${callbackBase}/api/webhooks/payments/daraja-balance`,
    ResultURL: `${callbackBase}/api/webhooks/payments/daraja-balance`,
  });

  if (String(raw.ResponseCode) !== "0") {
    throw new Error((raw.ResponseDescription as string) ?? "Daraja declined the balance request");
  }

  await setMpesaBalanceState({ status: "PENDING", requestedAt: new Date().toISOString() }, updatedById);
}

/** "Working Account|KES|481000.00|481000.00|0.00|0.00" — name|currency|balance|... (exact meaning of fields past #3 varies by account setup, so only those three are surfaced with confidence). */
function parseAccountBalanceValue(value: string): { accountName?: string; currency?: string; balance?: number } {
  const firstAccount = value.split("&")[0] ?? value;
  const parts = firstAccount.split("|");
  const balance = parts[2] !== undefined ? Number(parts[2]) : undefined;
  return {
    accountName: parts[0]?.trim() || undefined,
    currency: parts[1]?.trim() || undefined,
    balance: Number.isFinite(balance) ? balance : undefined,
  };
}

/** Called by the webhook with the raw callback body — never trusted blindly beyond parsing, since this is Safaricom's only channel for this result (no separate re-verification endpoint exists for AccountBalance the way STK has one). */
export async function applyBalanceCallback(payload: unknown): Promise<void> {
  const result = (payload as Record<string, unknown> | null)?.Result as Record<string, unknown> | undefined;
  if (!result) return;

  const resultCode = Number(result.ResultCode);
  const resultDesc = typeof result.ResultDesc === "string" ? result.ResultDesc : undefined;

  if (resultCode !== 0) {
    await setMpesaBalanceState({
      status: "FAILED",
      requestedAt: (await getMpesaBalanceState())?.requestedAt ?? new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      resultDesc,
    });
    return;
  }

  const params = (result.ResultParameters as Record<string, unknown> | undefined)?.ResultParameter as
    | { Key?: string; Value?: unknown }[]
    | undefined;
  const balanceParam = params?.find(p => p.Key === "AccountBalance");
  const parsed = typeof balanceParam?.Value === "string" ? parseAccountBalanceValue(balanceParam.Value) : {};

  await setMpesaBalanceState({
    status: "RECEIVED",
    requestedAt: (await getMpesaBalanceState())?.requestedAt ?? new Date().toISOString(),
    receivedAt: new Date().toISOString(),
    balance: parsed.balance,
    currency: parsed.currency,
    accountName: parsed.accountName,
    raw: typeof balanceParam?.Value === "string" ? balanceParam.Value : undefined,
    resultDesc,
  });
}
