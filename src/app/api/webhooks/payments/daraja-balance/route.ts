import { NextRequest, NextResponse } from "next/server";
import { applyBalanceCallback } from "@/server/payments/mpesaBalance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Safaricom expects exactly this shape acknowledged back, or it will keep retrying. */
const ACK = { ResultCode: 0, ResultDesc: "Confirmation Received Successfully" };

/**
 * Safaricom Daraja Account Balance result receiver. Used as both the
 * ResultURL and QueueTimeOutURL for the balance query — both deliver the
 * same `Result` shape (a non-zero ResultCode on the timeout path), so one
 * handler covers both. There's no separate endpoint to re-verify a balance
 * figure the way STK push has checkStatus, so unlike the payment webhooks
 * this one's payload is taken at face value — it only ever updates a
 * read-only "last known balance" display, never anything financial that
 * gets credited or trusted for a transaction. See /docs/PAYMENTS.md.
 */
export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => null);
  if (payload) {
    try {
      await applyBalanceCallback(payload);
    } catch (err) {
      console.error("[webhook/daraja-balance] apply error:", err instanceof Error ? err.message : err);
    }
  }
  return NextResponse.json(ACK);
}
