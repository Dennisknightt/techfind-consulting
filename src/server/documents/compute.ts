import "server-only";
import { computeDocumentTotals, type TaxConfig } from "@/lib/os/documentMath";
import { getTaxConfigAction } from "@/server/actions/settings";

export interface DraftItemInput {
  productKey?: string;
  label: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

/** Server-side recomputation — the client's preview numbers are never trusted for the stored record. */
export async function computeForSubmission(input: {
  items: DraftItemInput[];
  discount: number;
  depositPercent: number;
  taxModeOverride?: TaxConfig["mode"];
}) {
  const tax = await getTaxConfigAction();
  const totals = computeDocumentTotals({
    items: input.items.map(i => ({ quantity: i.quantity, unitPrice: i.unitPrice })),
    discount: input.discount,
    tax: input.taxModeOverride ? { ...tax, mode: input.taxModeOverride } : tax,
    depositPercent: input.depositPercent,
  });
  return { totals, tax };
}

export async function getActiveTax(): Promise<TaxConfig> {
  return getTaxConfigAction();
}
