import { formatKES } from "@/lib/os/money";
import type { TaxConfig } from "@/lib/os/documentMath";

const TITLE_MAP: Record<string, string> = { QUOTE: "QUOTATION", PROFORMA: "PROFORMA INVOICE", INVOICE: "TAX INVOICE" };

export interface PreviewItem {
  label: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

export function DocumentPreview({
  type, number, companyName, contactName, phone, email,
  items, subtotal, discount, tax, taxAmount, total,
  depositRequired, balance, paymentTermsLabel, notes, terms, validUntil,
}: {
  type: string;
  number: string;
  companyName: string;
  contactName?: string | null;
  phone?: string | null;
  email?: string | null;
  items: PreviewItem[];
  subtotal: number;
  discount: number;
  tax: TaxConfig;
  taxAmount: number;
  total: number;
  depositRequired: number;
  balance: number;
  paymentTermsLabel: string;
  notes?: string;
  terms?: string;
  validUntil?: Date | null;
}) {
  return (
    <div className="bg-white text-[#0B0F19] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] p-8 text-sm" style={{ fontFamily: "Georgia, serif" }}>
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="font-bold text-base tracking-tight">TECHFIND CONSULTING LIMITED</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Nairobi, Kenya · techfind.co.ke</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-sm" style={{ color: "#2F4A3E" }}>{TITLE_MAP[type] ?? type}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">{number}</p>
        </div>
      </div>

      <div className="flex justify-between mb-6 text-xs">
        <div>
          <p className="text-[9px] uppercase tracking-wide text-gray-400 mb-1">Client</p>
          <p className="font-semibold">{companyName || "—"}</p>
          {contactName && <p>{contactName}</p>}
          {phone && <p>{phone}</p>}
          {email && <p>{email}</p>}
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-wide text-gray-400 mb-1">Date</p>
          <p>{new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</p>
          {validUntil && (
            <>
              <p className="text-[9px] uppercase tracking-wide text-gray-400 mb-1 mt-2">Valid Until</p>
              <p>{validUntil.toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</p>
            </>
          )}
        </div>
      </div>

      <table className="w-full text-xs border-t border-gray-200">
        <thead>
          <tr className="border-b border-gray-200" style={{ background: "#F7F3EC" }}>
            <th className="text-left py-2 px-1 font-semibold text-[9px] uppercase tracking-wide text-gray-500">Item</th>
            <th className="text-center py-2 px-1 font-semibold text-[9px] uppercase tracking-wide text-gray-500 w-12">Qty</th>
            <th className="text-right py-2 px-1 font-semibold text-[9px] uppercase tracking-wide text-gray-500 w-20">Unit Price</th>
            <th className="text-right py-2 px-1 font-semibold text-[9px] uppercase tracking-wide text-gray-500 w-24">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr><td colSpan={4} className="text-center py-6 text-gray-400 text-xs">Add items to see them here</td></tr>
          )}
          {items.map((it, i) => (
            <tr key={i} className="border-b border-gray-100">
              <td className="py-2 px-1">
                <p className="font-semibold">{it.label}</p>
                {it.description && <p className="text-[10px] text-gray-500 mt-0.5">{it.description}</p>}
              </td>
              <td className="py-2 px-1 text-center">{it.quantity}</td>
              <td className="py-2 px-1 text-right">{formatKES(it.unitPrice, { compact: true })}</td>
              <td className="py-2 px-1 text-right font-medium">{formatKES(it.quantity * it.unitPrice, { compact: true })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col items-end mt-4 gap-1">
        <Row label="Subtotal" value={formatKES(subtotal)} />
        {discount > 0 && <Row label="Discount" value={`-${formatKES(discount)}`} />}
        {tax.mode !== "NONE" && <Row label={`${tax.label}${tax.mode === "INCLUSIVE" ? " (incl.)" : ""}`} value={formatKES(taxAmount)} />}
        <div className="flex justify-between w-56 pt-2 mt-1 border-t border-gray-900">
          <span className="font-bold text-sm">TOTAL</span>
          <span className="font-bold text-sm">{formatKES(total)}</span>
        </div>
      </div>

      {depositRequired > 0 && depositRequired < total && (
        <div className="mt-5 rounded-lg p-3 flex justify-between text-xs" style={{ background: "#F7F3EC" }}>
          <div><p className="text-[9px] uppercase text-gray-400 mb-0.5">Deposit Required</p><p className="font-semibold">{formatKES(depositRequired)}</p></div>
          <div><p className="text-[9px] uppercase text-gray-400 mb-0.5">Balance</p><p className="font-semibold">{formatKES(balance)}</p></div>
          <div><p className="text-[9px] uppercase text-gray-400 mb-0.5">Terms</p><p className="font-semibold">{paymentTermsLabel}</p></div>
        </div>
      )}

      <div className="mt-5 rounded-lg p-4 text-white" style={{ background: "#2F4A3E" }}>
        <p className="text-sm font-bold">Pay securely online</p>
        <p className="text-[10px] mt-1 opacity-80">Payment link generates once this document is created</p>
      </div>

      {notes && (
        <div className="mt-4">
          <p className="text-[9px] uppercase text-gray-400 mb-1">Notes</p>
          <p className="text-xs text-gray-600 whitespace-pre-wrap">{notes}</p>
        </div>
      )}
      {terms && (
        <div className="mt-3">
          <p className="text-[9px] uppercase text-gray-400 mb-1">Terms</p>
          <p className="text-xs text-gray-600 whitespace-pre-wrap">{terms}</p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between w-56 text-xs">
      <span className="text-gray-500">{label}</span>
      <span>{value}</span>
    </div>
  );
}
