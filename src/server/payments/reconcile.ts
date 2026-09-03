import "server-only";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { getActiveProvider } from "./registry";
import { writeAudit } from "@/server/audit";
import { round2 } from "@/lib/os/money";
import { nextReceiptNumber } from "@/server/documents/numbering";
import { handoffToProject } from "@/server/projects/handoff";
import type { Payment } from "@prisma/client";

/**
 * The single place a Payment is ever marked successful. Called from both
 * the client-side status poll and the webhook handler — always re-checks
 * status against the provider directly (never trusts the caller), and is
 * idempotent, so it's safe to call repeatedly from either path without
 * double-crediting a document.
 */
export async function confirmPayment(paymentId: string): Promise<Payment> {
  const payment = await db.payment.findUnique({ where: { id: paymentId } });
  if (!payment) throw new Error("Payment not found");
  if (payment.status === "SUCCESSFUL") return payment; // already reconciled — no-op
  if (!payment.gatewayReference) throw new Error("Payment has no gateway reference to verify");

  const { provider } = await getActiveProvider();
  const result = await provider.checkStatus(payment.gatewayReference);

  const updated = await db.payment.update({
    where: { id: paymentId },
    data: {
      status: result.status,
      gatewayRaw: JSON.stringify(result.raw).slice(0, 8000),
      ...(result.status === "SUCCESSFUL" ? { paidAt: new Date() } : {}),
    },
  });

  if (result.status === "SUCCESSFUL" && payment.status !== "SUCCESSFUL") {
    await applySuccessfulPayment(updated);
  }

  return updated;
}

/**
 * Applies every downstream effect of a payment landing (document balance,
 * deal WON, project handoff, receipt, notification). Exported so a manually
 * recorded payment (see recordManualPaymentAction) goes through the exact
 * same real logic as a provider-confirmed one — never a second, drifting
 * copy of "what happens when money arrives."
 */
export async function applySuccessfulPayment(payment: Payment): Promise<void> {
  await writeAudit({ action: "PAYMENT_CONFIRMED", entityType: "Payment", entityId: payment.id, after: payment });

  if (!payment.documentId) return;

  const doc = await db.salesDocument.update({
    where: { id: payment.documentId },
    data: {
      paidAmount: { increment: payment.amount },
    },
    include: { company: true, deal: true, owner: true },
  });

  const paidAmount = round2(doc.paidAmount);
  const balance = round2(Math.max(0, doc.total - paidAmount));
  const newStatus = balance <= 0 ? "PAID" : "PARTIALLY_PAID";

  await db.salesDocument.update({ where: { id: doc.id }, data: { balance, status: newStatus } });

  if (paidAmount >= doc.depositRequired) {
    if (doc.dealId && doc.deal && doc.deal.stage !== "WON") {
      await db.deal.update({ where: { id: doc.dealId }, data: { stage: "WON", wonAt: new Date(), lastContactAt: new Date() } });
    }
    // Deposit reached is the handoff trigger regardless of whether this sale
    // ever had an explicit Deal — a quick walk-up proforma with no deal
    // still needs to become a project (handoffToProject infers one).
    await handoffToProject(doc);
  }

  const receiptNumber = await nextReceiptNumber();
  await db.receipt.create({
    data: {
      number: receiptNumber,
      paymentId: payment.id,
      documentId: doc.id,
      companyId: doc.companyId,
      amount: payment.amount,
      method: payment.method,
    },
  });

  if (doc.ownerId) {
    await db.notification.create({
      data: {
        userId: doc.ownerId,
        type: "PAYMENT_RECEIVED",
        title: "💰 Payment received",
        body: `${new Intl.NumberFormat("en-KE").format(payment.amount)} KES from ${doc.company.name} — ${doc.number}`,
        relatedType: "PAYMENT",
        relatedId: payment.id,
      },
    });
  }

  revalidatePath("/app");
  revalidatePath("/app/payments");
  revalidatePath("/app/revenue");
  revalidatePath("/app/projects");
  revalidatePath(`/app/quotes/${doc.id}`);
  if (doc.dealId) revalidatePath(`/app/deals/${doc.dealId}`);
  revalidatePath(`/app/clients/${doc.companyId}`);
}
