import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { confirmPayment } from "@/server/payments/reconcile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * IntaSend webhook receiver. The payload's claimed status is never trusted
 * directly — it's only used to find which Payment to re-check, and
 * confirmPayment() re-verifies with an authoritative server-to-server call
 * back to IntaSend before crediting anything. This sidesteps needing an
 * exact signature-verification recipe (IntaSend's webhook signing isn't
 * documented in the SDK) while still being safe: a forged webhook can at
 * worst trigger a status re-check, never a false credit.
 *
 * Register this URL (…/api/webhooks/payments/intasend) in the IntaSend
 * dashboard once ready to receive live events.
 */
export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }

  const gatewayReference = String(
    pick(payload, ["invoice_id", "invoice.invoice_id", "id", "checkout_id"]) ?? ""
  );
  if (!gatewayReference) {
    return NextResponse.json({ ok: true, ignored: "no reference in payload" });
  }

  const payment = await db.payment.findFirst({ where: { gatewayReference } });
  if (!payment) {
    // Not necessarily an error — could be a webhook for a transaction Techfind didn't initiate.
    return NextResponse.json({ ok: true, ignored: "unknown reference" });
  }

  try {
    await confirmPayment(payment.id);
  } catch (err) {
    console.error("[webhook/intasend] confirm error:", err instanceof Error ? err.message : err);
    // Still 200 — IntaSend will retry undelivered webhooks; a 5xx here just adds noise.
  }

  return NextResponse.json({ ok: true });
}

function pick(raw: unknown, paths: string[]): unknown {
  for (const path of paths) {
    let cur: unknown = raw;
    for (const key of path.split(".")) {
      if (cur && typeof cur === "object" && key in (cur as Record<string, unknown>)) {
        cur = (cur as Record<string, unknown>)[key];
      } else {
        cur = undefined;
        break;
      }
    }
    if (cur !== undefined && cur !== null) return cur;
  }
  return undefined;
}
