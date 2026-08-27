import "server-only";
import { db } from "@/server/db";

const PREFIX: Record<string, string> = { QUOTE: "QT", PROFORMA: "PF", INVOICE: "INV" };

/**
 * Atomically issues the next document number for the given type/year, e.g.
 * TF-PF-2026-0087. Uses the Counter table with a transaction so concurrent
 * proforma creation never collides — financial document numbers must be
 * unique and gapless-enough to be trustworthy.
 */
export async function nextDocumentNumber(type: string): Promise<string> {
  const year = new Date().getFullYear();
  const key = `${PREFIX[type] ?? type}-${year}`;

  const counter = await db.$transaction(async (tx) => {
    const existing = await tx.counter.findUnique({ where: { key } });
    if (existing) {
      return tx.counter.update({ where: { key }, data: { value: { increment: 1 } } });
    }
    return tx.counter.create({ data: { key, value: 1 } });
  });

  const seq = String(counter.value).padStart(4, "0");
  return `TF-${PREFIX[type] ?? type}-${year}-${seq}`;
}

export async function nextReceiptNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const key = `RCT-${year}`;
  const counter = await db.$transaction(async (tx) => {
    const existing = await tx.counter.findUnique({ where: { key } });
    if (existing) return tx.counter.update({ where: { key }, data: { value: { increment: 1 } } });
    return tx.counter.create({ data: { key, value: 1 } });
  });
  const seq = String(counter.value).padStart(4, "0");
  return `TF-RCT-${year}-${seq}`;
}
