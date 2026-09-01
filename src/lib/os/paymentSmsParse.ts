/**
 * Best-effort parser for Kenyan payment-confirmation SMS text — currently
 * Safaricom M-Pesa and Equity Bank, the two Techfind actually receives.
 * Never fabricates a field it can't find — every result is reviewed and
 * editable in the record-payment form before anything is saved, so a
 * partial parse is fine; a wrong silent guess is not.
 *
 * M-Pesa shapes handled:
 *  "RJ61ABC2D3 Confirmed. You have received Ksh1,500.00 from JOHN KAMAU
 *   254712345678 on 1/9/26 at 2:45 PM. New M-PESA balance is Ksh10,230.50."
 *  "RJ61ABC2D3 Confirmed.Ksh1,500.00 received from JANE DOE 0712345678
 *   for account INV-1024 on 1/9/26 at 2:45 PM. New Utility balance is ..."
 *
 * Equity Bank shape handled:
 *  "You have received 27000.00 KES from BEST BUDGET ICT SOLUTIONS
 *   0********5198 to your Equity account 1********8537. Ref. AD01C46BF3866
 *   on 01 Sep 2026 at 09:01 EAT"
 */

export type PaymentSmsSource = "MPESA" | "EQUITY" | "UNKNOWN";

export interface ParsedPaymentMessage {
  source: PaymentSmsSource;
  transactionCode?: string;
  amount?: number;
  payerName?: string;
  payerPhone?: string;
  accountReference?: string;
  paidAt?: Date;
}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function parseAmount(raw: string): number {
  return Number(raw.replace(/,/g, ""));
}

/** M-Pesa style: "1/9/26" + "2:45 PM" */
function parseSlashDateTime(dateStr: string, timeStr: string): Date | undefined {
  const dm = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  const tm = timeStr.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
  if (!dm || !tm) return undefined;

  const day = Number(dm[1]);
  const month = Number(dm[2]);
  let year = Number(dm[3]);
  if (year < 100) year += 2000;

  let hour = Number(tm[1]) % 12;
  if (tm[3].toUpperCase() === "PM") hour += 12;
  const minute = Number(tm[2]);

  const date = new Date(year, month - 1, day, hour, minute);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** Equity (and most bank) style: "01 Sep 2026" + "09:01" (24h) */
function parseTextDateTime(dateStr: string, timeStr: string): Date | undefined {
  const dm = dateStr.match(/^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/);
  if (!dm) return undefined;
  const month = MONTHS[dm[2].slice(0, 3).toLowerCase()];
  if (!month) return undefined;

  const tm = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!tm) return undefined;

  const date = new Date(Number(dm[3]), month - 1, Number(dm[1]), Number(tm[1]), Number(tm[2]));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function parseMpesa(t: string): ParsedPaymentMessage {
  const result: ParsedPaymentMessage = { source: "MPESA" };

  const codeMatch = t.match(/^([A-Z0-9]{8,12})\s+Confirmed/i);
  if (codeMatch) result.transactionCode = codeMatch[1].toUpperCase();

  const amountMatch = t.match(/Ksh\s?([\d,]+(?:\.\d{2})?)/i);
  if (amountMatch) result.amount = parseAmount(amountMatch[1]);

  const nameAndPhoneMatch = t.match(/from\s+([A-Z][A-Z' .]+?)\s+(254\d{9}|0\d{9})\b/);
  if (nameAndPhoneMatch) {
    result.payerName = nameAndPhoneMatch[1].trim();
    result.payerPhone = nameAndPhoneMatch[2];
  } else {
    const nameOnlyMatch = t.match(/from\s+([A-Z][A-Z' .]+?)\s+on\s+\d/);
    if (nameOnlyMatch) result.payerName = nameOnlyMatch[1].trim();
  }

  const accountMatch = t.match(/for account\s+(\S+)/i);
  if (accountMatch) result.accountReference = accountMatch[1];

  const dateTimeMatch = t.match(/on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+(\d{1,2}:\d{2}\s?[AP]M)/i);
  if (dateTimeMatch) result.paidAt = parseSlashDateTime(dateTimeMatch[1], dateTimeMatch[2]);

  return result;
}

function parseEquity(t: string): ParsedPaymentMessage {
  const result: ParsedPaymentMessage = { source: "EQUITY" };

  const amountMatch = t.match(/([\d,]+\.\d{2})\s*KES/i);
  if (amountMatch) result.amount = parseAmount(amountMatch[1]);

  const nameMatch = t.match(/from\s+([A-Z][A-Za-z0-9 .&'-]*?)\s+(\S+)\s+to your/i);
  if (nameMatch) {
    result.payerName = nameMatch[1].trim();
    result.payerPhone = nameMatch[2]; // often a masked phone/account number, e.g. "0********5198"
  } else {
    const nameOnlyMatch = t.match(/from\s+([A-Z][A-Za-z0-9 .&'-]*?)\s+to your/i);
    if (nameOnlyMatch) result.payerName = nameOnlyMatch[1].trim();
  }

  const refMatch = t.match(/Ref\.?\s*([A-Z0-9]+)/i);
  if (refMatch) result.transactionCode = refMatch[1].toUpperCase();

  const dateTimeMatch = t.match(/on\s+(\d{1,2}\s+[A-Za-z]{3,}\s+\d{4})\s+at\s+(\d{1,2}:\d{2})/i);
  if (dateTimeMatch) result.paidAt = parseTextDateTime(dateTimeMatch[1], dateTimeMatch[2]);

  return result;
}

export function parsePaymentMessage(text: string): ParsedPaymentMessage {
  const t = text.trim();
  if (/equity/i.test(t)) return parseEquity(t);
  if (/confirmed/i.test(t) && /ksh/i.test(t)) return parseMpesa(t);
  // Unrecognized source — still attempt the M-Pesa patterns since "Ksh" +
  // "from NAME PHONE" + "on D/M/Y at H:MM AM/PM" is common to other
  // Safaricom-adjacent senders too, but tag it UNKNOWN so the UI doesn't
  // claim a confident match it doesn't have.
  return { ...parseMpesa(t), source: "UNKNOWN" };
}

/** True if the parser found enough to be worth showing (vs. clearly not a payment SMS). */
export function looksLikePaymentMessage(text: string): boolean {
  return (/confirmed/i.test(text) && /ksh/i.test(text)) || (/equity/i.test(text) && /kes/i.test(text));
}

export interface ManualPaymentMeta {
  rawMessage?: string;
  payerName?: string;
  payerPhone?: string;
}

/**
 * Reads back the payer context a manually-recorded payment stored in its
 * `gatewayRaw` column. Only meaningful for gateway === "MANUAL" rows —
 * a gateway-confirmed payment's gatewayRaw is the provider's own raw
 * response JSON, a different shape entirely, so this safely returns {}
 * for those rather than misreading provider data as payer info.
 */
export function parseManualPaymentMeta(gatewayRaw: string | null): ManualPaymentMeta {
  if (!gatewayRaw) return {};
  try {
    const obj = JSON.parse(gatewayRaw);
    if (obj && obj.source === "MANUAL_ENTRY") {
      return { rawMessage: obj.rawMessage, payerName: obj.payerName, payerPhone: obj.payerPhone };
    }
  } catch {
    // Not our JSON shape — ignore.
  }
  return {};
}
