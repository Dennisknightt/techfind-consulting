import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

const basePrisma =
  globalThis.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalThis.__prisma = basePrisma;

/**
 * Currency amounts are stored as `Decimal` (exact `numeric(12,2)` in
 * Postgres — see docs/DATABASE.md) so they never drift the way `Float`
 * could, but the rest of the app is written against plain `number`
 * (`formatKES`, `round2`, arithmetic, JSON over the wire to Client
 * Components). This extension converts every Decimal money field back to
 * a `number` right as it comes out of the client, so the exactness lives
 * only in the database column and nowhere else has to deal with a
 * `Prisma.Decimal` instance. Writes are unaffected — Prisma already
 * accepts a plain `number` for a Decimal field on create/update.
 */
export const db = basePrisma.$extends({
  result: {
    lead: {
      value: { needs: { value: true }, compute: (l) => l.value.toNumber() },
    },
    deal: {
      value: { needs: { value: true }, compute: (d) => d.value.toNumber() },
    },
    quickItem: {
      totalPrice: { needs: { totalPrice: true }, compute: (q) => q.totalPrice.toNumber() },
    },
    package: {
      price: { needs: { price: true }, compute: (p) => p.price.toNumber() },
    },
    productFootprint: {
      mrr: { needs: { mrr: true }, compute: (f) => (f.mrr === null ? null : f.mrr.toNumber()) },
    },
    salesDocument: {
      subtotal: { needs: { subtotal: true }, compute: (d) => d.subtotal.toNumber() },
      discount: { needs: { discount: true }, compute: (d) => d.discount.toNumber() },
      taxAmount: { needs: { taxAmount: true }, compute: (d) => d.taxAmount.toNumber() },
      total: { needs: { total: true }, compute: (d) => d.total.toNumber() },
      depositRequired: { needs: { depositRequired: true }, compute: (d) => d.depositRequired.toNumber() },
      balance: { needs: { balance: true }, compute: (d) => d.balance.toNumber() },
      paidAmount: { needs: { paidAmount: true }, compute: (d) => d.paidAmount.toNumber() },
    },
    salesDocumentItem: {
      unitPrice: { needs: { unitPrice: true }, compute: (i) => i.unitPrice.toNumber() },
      amount: { needs: { amount: true }, compute: (i) => i.amount.toNumber() },
    },
    paymentSession: {
      amountDue: { needs: { amountDue: true }, compute: (s) => s.amountDue.toNumber() },
    },
    payment: {
      amount: { needs: { amount: true }, compute: (p) => p.amount.toNumber() },
      refundedAmount: { needs: { refundedAmount: true }, compute: (p) => p.refundedAmount.toNumber() },
    },
    receipt: {
      amount: { needs: { amount: true }, compute: (r) => r.amount.toNumber() },
    },
  },
});
