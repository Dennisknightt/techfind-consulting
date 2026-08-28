import { round2 } from "./money";

export type TaxMode = "INCLUSIVE" | "EXCLUSIVE" | "NONE";

export interface LineItemInput {
  quantity: number;
  unitPrice: number;
}

export interface TaxConfig {
  mode: TaxMode;
  rate: number; // percent, e.g. 16
  label: string; // e.g. "VAT"
}

export interface DocumentTotals {
  grossItemTotal: number;
  subtotal: number;
  discount: number;
  taxAmount: number;
  total: number;
  depositRequired: number;
  balance: number;
}

export const PAYMENT_TERMS = ["100%", "70/30", "60/40", "50/50", "40/30/30", "Custom"] as const;
export type PaymentTermsPreset = (typeof PAYMENT_TERMS)[number];

export function depositPercentFor(preset: PaymentTermsPreset, customPct?: number): number {
  switch (preset) {
    case "100%": return 100;
    case "70/30": return 70;
    case "60/40": return 60;
    case "50/50": return 50;
    case "40/30/30": return 40;
    case "Custom": return Math.max(0, Math.min(100, customPct ?? 100));
  }
}

export function computeDocumentTotals(input: {
  items: LineItemInput[];
  discount: number;
  tax: TaxConfig;
  depositPercent: number;
}): DocumentTotals {
  const grossItemTotal = round2(input.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0));
  const discount = round2(Math.min(input.discount, grossItemTotal));
  const grossAfterDiscount = round2(grossItemTotal - discount);

  let subtotal: number;
  let taxAmount: number;
  let total: number;

  if (input.tax.mode === "INCLUSIVE") {
    total = grossAfterDiscount;
    taxAmount = round2(total - total / (1 + input.tax.rate / 100));
    subtotal = round2(total - taxAmount);
  } else if (input.tax.mode === "EXCLUSIVE") {
    subtotal = grossAfterDiscount;
    taxAmount = round2(subtotal * (input.tax.rate / 100));
    total = round2(subtotal + taxAmount);
  } else {
    subtotal = grossAfterDiscount;
    taxAmount = 0;
    total = subtotal;
  }

  const depositRequired = round2(total * (input.depositPercent / 100));
  const balance = round2(total - depositRequired);

  return { grossItemTotal, subtotal, discount, taxAmount, total, depositRequired, balance };
}
