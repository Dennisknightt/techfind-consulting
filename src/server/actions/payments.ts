"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requirePermission } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";
import { round2 } from "@/lib/os/money";
import { getActiveProvider } from "@/server/payments/registry";
import { confirmPayment, applySuccessfulPayment } from "@/server/payments/reconcile";

/**
 * Techfind has no walk-in customers — every invoice's outstanding balance
 * should be collectible with one click, from wherever a salesperson is
 * looking at it (the document itself, the deal, the client). This is the
 * single place that logic lives: given a document, always resolve (or
 * refresh) the one active payment link for its *current* outstanding
 * balance, so "Request Payment" and "Request Balance" are the same
 * operation — there's nothing left to pay once balance is 0.
 */
const SESSION_TTL_DAYS = 30;
const STK_COOLDOWN_MS = 60_000; // don't let a second prompt land on the customer's phone within a minute
const STK_MAX_PER_HOUR = 3; // avoid hammering a non-responsive customer

async function getOrRefreshSession(documentId: string, amountDue: number) {
  const existing = await db.paymentSession.findFirst({
    where: { documentId, status: "ACTIVE", expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (existing) {
    if (existing.amountDue !== amountDue) {
      return db.paymentSession.update({ where: { id: existing.id }, data: { amountDue } });
    }
    return existing;
  }
  return db.paymentSession.create({
    data: {
      token: randomBytes(24).toString("hex"),
      documentId,
      amountDue,
      expiresAt: new Date(Date.now() + SESSION_TTL_DAYS * 86_400_000),
    },
  });
}

export interface PaymentRequestPreview {
  documentId: string;
  documentNumber: string;
  clientName: string;
  phone: string | null;
  amountDue: number;
  url: string;
  isBalance: boolean; // true once something has already been paid — "Request Balance" framing
}

/** Everything a "Request Payment" confirm sheet needs — no re-entry of anything the CRM already knows. */
export async function getPaymentRequestPreviewAction(documentId: string): Promise<PaymentRequestPreview> {
  await requirePermission("documents.write");
  const doc = await db.salesDocument.findUniqueOrThrow({ where: { id: documentId }, include: { company: true } });
  const amountDue = round2(doc.balance);
  if (amountDue <= 0) throw new Error("This invoice is already fully paid");

  const session = await getOrRefreshSession(documentId, amountDue);
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return {
    documentId: doc.id,
    documentNumber: doc.number,
    clientName: doc.company.name,
    phone: doc.company.phone,
    amountDue,
    url: `${base}/pay/${session.token}`,
    isBalance: doc.paidAmount > 0,
  };
}

/** Logs the request to the client timeline. The actual WhatsApp compose happens client-side (wa.me), same as document sends. */
export async function logPaymentRequestSentAction(documentId: string, message: string) {
  const user = await requirePermission("documents.write");
  const doc = await db.salesDocument.findUniqueOrThrow({ where: { id: documentId } });

  await db.communication.create({
    data: {
      companyId: doc.companyId,
      contactId: doc.contactId,
      dealId: doc.dealId,
      channel: "WHATSAPP",
      direction: "OUTBOUND",
      subject: `Payment request · ${doc.number}`,
      body: message,
      authorId: user.id,
    },
  });

  await writeAudit({ actorId: user.id, action: "PAYMENT_REQUEST_SENT", entityType: "SalesDocument", entityId: documentId });
  revalidatePath(`/app/quotes/${documentId}`);
}

/**
 * Direct M-Pesa STK push, triggered by a Techfind user from inside the CRM
 * against the client's phone on file — no link, no customer action beyond
 * entering their PIN on their own phone. Rate-limited per document so a
 * non-responsive customer doesn't get repeatedly buzzed.
 */
export async function sendStkPushAction(documentId: string): Promise<{ paymentId: string; status: string }> {
  const user = await requirePermission("documents.write");
  const doc = await db.salesDocument.findUniqueOrThrow({ where: { id: documentId }, include: { company: true } });

  const amountDue = round2(doc.balance);
  if (amountDue <= 0) throw new Error("This invoice is already fully paid");
  if (!doc.company.phone) throw new Error("This client has no phone number on file");

  const oneHourAgo = new Date(Date.now() - 60 * 60_000);
  const recentAttempts = await db.payment.findMany({
    where: { documentId, method: "MPESA", createdAt: { gte: oneHourAgo } },
    orderBy: { createdAt: "desc" },
  });
  if (recentAttempts.length > 0) {
    const msSinceLast = Date.now() - recentAttempts[0].createdAt.getTime();
    if (msSinceLast < STK_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((STK_COOLDOWN_MS - msSinceLast) / 1000);
      throw new Error(`Please wait ${waitSeconds}s before sending another prompt`);
    }
  }
  if (recentAttempts.length >= STK_MAX_PER_HOUR) {
    throw new Error("Too many prompts sent this hour — try a payment link instead, or wait before retrying");
  }

  const { provider } = await getActiveProvider();
  const session = await getOrRefreshSession(documentId, amountDue);
  const idempotencyKey = `${session.id}:${randomBytes(6).toString("hex")}`;

  const payment = await db.payment.create({
    data: {
      reference: `PAY-${randomBytes(6).toString("hex").toUpperCase()}`,
      sessionId: session.id,
      documentId: doc.id,
      companyId: doc.companyId,
      dealId: doc.dealId,
      amount: amountDue,
      method: "MPESA",
      gateway: provider.name,
      status: "PENDING",
      idempotencyKey,
      recordedById: user.id,
    },
  });

  try {
    const result = await provider.createCharge({
      amount: amountDue,
      currency: doc.currency,
      method: "MPESA",
      reference: idempotencyKey,
      phone: doc.company.phone,
      email: doc.company.email ?? undefined,
      name: doc.company.name,
    });

    await db.payment.update({
      where: { id: payment.id },
      data: { gatewayReference: result.gatewayReference, status: result.status, gatewayRaw: JSON.stringify(result.raw).slice(0, 8000) },
    });

    await writeAudit({ actorId: user.id, action: "STK_PUSH_SENT", entityType: "Payment", entityId: payment.id, after: { documentId, amount: amountDue } });
    return { paymentId: payment.id, status: result.status };
  } catch (err) {
    await db.payment.update({ where: { id: payment.id }, data: { status: "FAILED", notes: err instanceof Error ? err.message.slice(0, 500) : "Charge failed" } });
    throw new Error("Couldn't send the M-Pesa prompt. Please try again.");
  }
}

/** Authenticated poll for the CRM-side "Waiting for customer…" UI — mirrors the public status endpoint's trust rules. */
export async function checkStkStatusAction(paymentId: string): Promise<{ status: string; amount?: number }> {
  await requirePermission("documents.write");
  const updated = await confirmPayment(paymentId);
  return { status: updated.status, amount: updated.amount };
}

/** Outstanding (sent/viewed/partially paid, balance > 0) documents for a client — the pick-list for linking a manually recorded payment. */
export async function getOutstandingDocumentsAction(companyId: string) {
  await requirePermission("payments.write");
  return db.salesDocument.findMany({
    where: { companyId, balance: { gt: 0 }, status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID"] } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export interface ManualPaymentInput {
  amount: number;
  method: string; // MPESA | BANK | CASH | OTHER
  transactionCode?: string;
  payerName?: string;
  payerPhone?: string;
  paidAt?: Date;
  companyId?: string;
  documentId?: string;
  notes?: string;
  rawMessage?: string;
}

/**
 * Records a payment Techfind received outside the automated gateway flow —
 * most often an M-Pesa or Equity SMS pasted and parsed (see paymentSmsParse.ts), but also
 * a bank transfer or cash handed over in person. When linked to an invoice
 * it goes through the exact same applySuccessfulPayment logic a
 * provider-confirmed payment does (balance, deal WON, project handoff,
 * receipt, notification) — recording it manually never means a second,
 * lesser code path.
 */
export async function recordManualPaymentAction(input: ManualPaymentInput) {
  const user = await requirePermission("payments.write");
  const amount = round2(input.amount);
  if (!amount || amount <= 0) throw new Error("Enter a valid amount");
  if (!input.method) throw new Error("Select a payment method");

  if (input.transactionCode) {
    const duplicate = await db.payment.findFirst({ where: { gatewayReference: input.transactionCode } });
    if (duplicate) throw new Error(`A payment with code ${input.transactionCode} has already been recorded`);
  }

  let document = null;
  if (input.documentId) {
    document = await db.salesDocument.findUniqueOrThrow({ where: { id: input.documentId } });
    if (amount > round2(document.balance) + 0.5) {
      throw new Error(`That's more than the outstanding balance of ${round2(document.balance)}`);
    }
  }

  const hasSourceContext = input.rawMessage || input.payerName || input.payerPhone;
  const payment = await db.payment.create({
    data: {
      reference: `PAY-${randomBytes(6).toString("hex").toUpperCase()}`,
      documentId: input.documentId,
      companyId: input.companyId ?? document?.companyId,
      dealId: document?.dealId,
      amount,
      method: input.method,
      gateway: "MANUAL",
      gatewayReference: input.transactionCode || null,
      status: "SUCCESSFUL",
      paidAt: input.paidAt ?? new Date(),
      recordedById: user.id,
      notes: input.notes || null,
      gatewayRaw: hasSourceContext
        ? JSON.stringify({ source: "MANUAL_ENTRY", rawMessage: input.rawMessage, payerName: input.payerName, payerPhone: input.payerPhone }).slice(0, 8000)
        : null,
    },
  });

  if (document) {
    await applySuccessfulPayment(payment);
  } else {
    await writeAudit({ actorId: user.id, action: "RECORD_MANUAL_PAYMENT", entityType: "Payment", entityId: payment.id, after: payment });
    revalidatePath("/app/payments");
    revalidatePath("/app");
    if (input.companyId) revalidatePath(`/app/clients/${input.companyId}`);
  }

  return payment;
}
