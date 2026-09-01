"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requirePermission } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";
import { round2 } from "@/lib/os/money";
import { resolveProviderForRefund } from "@/server/payments/registry";

export interface RefundResult {
  error?: string;
}

/**
 * Refunds are staff-initiated, not customer-claimed — unlike a charge
 * (where we must never trust the caller and always re-verify with the
 * gateway), the provider call here IS the authoritative action: if it
 * doesn't throw, the refund happened. Supports partial refunds via
 * Payment.refundedAmount, capped at what hasn't already been refunded.
 */
export async function refundPaymentAction(paymentId: string, amount: number, reason: string): Promise<RefundResult> {
  const user = await requirePermission("payments.write");

  const payment = await db.payment.findUnique({ where: { id: paymentId } });
  if (!payment) return { error: "Payment not found." };
  if (payment.status !== "SUCCESSFUL" && payment.status !== "PARTIALLY_REFUNDED") {
    return { error: "Only successful payments can be refunded." };
  }
  if (!payment.gatewayReference) return { error: "This payment has no gateway reference to refund against." };

  const trimmedReason = reason.trim();
  if (!trimmedReason) return { error: "A reason is required for the audit trail." };

  const remaining = round2(payment.amount - payment.refundedAmount);
  const refundAmount = round2(amount);
  if (!Number.isFinite(refundAmount) || refundAmount <= 0) return { error: "Enter a valid refund amount." };
  if (refundAmount > remaining) return { error: `You can refund at most ${remaining} more on this payment.` };

  let provider;
  try {
    provider = resolveProviderForRefund(payment.gateway);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Refunds are blocked in this environment." };
  }

  try {
    await provider.refund({ gatewayReference: payment.gatewayReference, amount: refundAmount, reason: trimmedReason });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "The gateway rejected this refund." };
  }

  const newRefundedAmount = round2(payment.refundedAmount + refundAmount);
  const newStatus = newRefundedAmount >= payment.amount ? "REFUNDED" : "PARTIALLY_REFUNDED";

  await db.payment.update({
    where: { id: paymentId },
    data: { refundedAmount: newRefundedAmount, status: newStatus },
  });

  await writeAudit({
    actorId: user.id, action: "PAYMENT_REFUNDED", entityType: "Payment", entityId: paymentId,
    before: { refundedAmount: payment.refundedAmount, status: payment.status },
    after: { refundedAmount: newRefundedAmount, status: newStatus, refundAmount, reason: trimmedReason },
  });

  if (payment.documentId) {
    const doc = await db.salesDocument.findUnique({ where: { id: payment.documentId } });
    if (doc) {
      const paidAmount = round2(Math.max(0, doc.paidAmount - refundAmount));
      const balance = round2(Math.max(0, doc.total - paidAmount));
      const docStatus = balance <= 0 ? "PAID" : "PARTIALLY_PAID";
      await db.salesDocument.update({ where: { id: doc.id }, data: { paidAmount, balance, status: docStatus } });
      revalidatePath(`/app/quotes/${doc.id}`);
      if (doc.dealId) revalidatePath(`/app/deals/${doc.dealId}`);
      revalidatePath(`/app/clients/${doc.companyId}`);
    }
  }

  revalidatePath("/app/payments");
  revalidatePath("/app/revenue");
  revalidatePath("/app");

  return {};
}
