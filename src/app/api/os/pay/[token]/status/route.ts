import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { confirmPayment } from "@/server/payments/reconcile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public — polled by /pay/[token] while a charge is in flight. Scoped strictly to payments belonging to this token's session. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const paymentId = req.nextUrl.searchParams.get("paymentId");
  if (!paymentId) return NextResponse.json({ error: "paymentId is required" }, { status: 400 });

  const session = await db.paymentSession.findUnique({ where: { token } });
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const payment = await db.payment.findUnique({ where: { id: paymentId } });
  if (!payment || payment.sessionId !== session.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (payment.status === "PENDING" || payment.status === "PROCESSING") {
    try {
      const updated = await confirmPayment(payment.id);
      return NextResponse.json({ status: updated.status, amount: updated.amount });
    } catch (err) {
      console.error("[pay/status] confirm error:", err instanceof Error ? err.message : err);
      return NextResponse.json({ status: payment.status, amount: payment.amount });
    }
  }

  return NextResponse.json({ status: payment.status, amount: payment.amount });
}
