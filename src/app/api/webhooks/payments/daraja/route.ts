import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { confirmPayment } from "@/server/payments/reconcile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Safaricom expects exactly this shape acknowledged back, or it will keep retrying. */
const ACK = { ResultCode: 0, ResultDesc: "Confirmation Received Successfully" };

/**
 * Safaricom Daraja STK callback receiver. Unlike IntaSend, Daraja has no
 * webhook signature or shared-secret mechanism to verify — Safaricom simply
 * POSTs to whatever CallBackURL was given at STK-push time. That's fine
 * because, exactly as with the IntaSend webhook, the payload's claimed
 * result is never trusted directly: it's only used to find which Payment to
 * re-check, and confirmPayment() re-verifies with an authoritative
 * server-to-server call back to Daraja's own STK query endpoint before
 * crediting anything. A forged POST here can at worst trigger a pointless
 * status re-check against a real M-Pesa transaction — never a false credit.
 *
 * Register this URL (…/api/webhooks/payments/daraja) as the STK push
 * CallBackURL — done automatically per-request by darajaProvider.ts, so
 * there's nothing to configure on Safaricom's side beyond the shortcode/app
 * itself. See /docs/PAYMENTS.md.
 */
export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => null);
  const callback = (payload as Record<string, unknown> | null)?.Body as Record<string, unknown> | undefined;
  const stkCallback = callback?.stkCallback as Record<string, unknown> | undefined;

  const gatewayReference = stkCallback?.CheckoutRequestID ? String(stkCallback.CheckoutRequestID) : "";
  if (!gatewayReference) {
    return NextResponse.json(ACK);
  }

  const payment = await db.payment.findFirst({ where: { gatewayReference } });
  if (!payment) {
    // Not necessarily an error — could be a callback for a transaction Techfind didn't initiate.
    return NextResponse.json(ACK);
  }

  try {
    await confirmPayment(payment.id);
  } catch (err) {
    console.error("[webhook/daraja] confirm error:", err instanceof Error ? err.message : err);
    // Still ack — Safaricom will retry undelivered callbacks; a non-200 here just adds noise.
  }

  return NextResponse.json(ACK);
}
