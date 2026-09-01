/**
 * Best-effort parser for Safaricom M-Pesa payment-confirmation SMS text
 * (personal, Till/Buy-Goods, and Paybill "received" messages). Never
 * fabricates a field it can't find — every result is reviewed and editable
 * in the record-payment form before anything is saved, so a partial parse
 * is fine; a wrong silent guess is not.
 *
 * Typical shapes handled:
 *  "RJ61ABC2D3 Confirmed. You have received Ksh1,500.00 from JOHN KAMAU
 *   254712345678 on 1/9/26 at 2:45 PM. New M-PESA balance is Ksh10,230.50."
 *  "RJ61ABC2D3 Confirmed.Ksh1,500.00 received from JANE DOE 0712345678
 *   for account INV-1024 on 1/9/26 at 2:45 PM. New Utility balance is ..."
 */

export interface ParsedMpesaPayment {
  transactionCode?: string;
  amount?: number;
  payerName?: string;
  payerPhone?: string;
  accountReference?: string;
  paidAt?: Date;
}

function parseAmount(raw: string): number {
  return Number(raw.replace(/,/g, ""));
}

function parseDateTime(dateStr: string, timeStr: string): Date | undefined {
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

export function parseMpesaMessage(text: string): ParsedMpesaPayment {
  const t = text.trim();
  const result: ParsedMpesaPayment = {};

  const codeMatch = t.match(/^([A-Z0-9]{8,12})\s+Confirmed/i);
  if (codeMatch) result.transactionCode = codeMatch[1].toUpperCase();

  const amountMatch = t.match(/Ksh\s?([\d,]+(?:\.\d{2})?)/i);
  if (amountMatch) result.amount = parseAmount(amountMatch[1]);

  const nameAndPhoneMatch = t.match(/from\s+([A-Z][A-Z' .]+?)\s+(2\d{9}|0\d{9})\b/);
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
  if (dateTimeMatch) result.paidAt = parseDateTime(dateTimeMatch[1], dateTimeMatch[2]);

  return result;
}

/** True if the parser found enough to be worth showing (vs. clearly not an M-Pesa message). */
export function looksLikeMpesaMessage(text: string): boolean {
  return /confirmed/i.test(text) && /ksh/i.test(text);
}
