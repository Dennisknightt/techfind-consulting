import "server-only";
import IntaSend from "intasend-node";
import type { PaymentProvider, ChargeInput, ChargeResult, StatusResult, RefundInput, ProviderStatus } from "./provider";

/**
 * Real IntaSend integration (M-Pesa STK push + hosted checkout for card).
 * Built against the official intasend-node SDK — see
 * node_modules/intasend-node for the exact request/response shapes this
 * was verified against, since IntaSend's TypeScript definitions are
 * untyped (`any`) and don't document response fields.
 *
 * IntaSend's response shapes aren't formally documented in the SDK, so
 * every read below is defensive: several plausible field paths are tried,
 * and status only ever maps to SUCCESSFUL on an explicit positive
 * signal — anything ambiguous falls back to PENDING rather than guessing.
 * See /docs/PAYMENTS.md.
 */

function client(): IntaSend {
  const pub = process.env.NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY;
  const secret = process.env.INTASEND_SECRET_KEY;
  if (!pub || !secret) throw new Error("IntaSend is not configured (missing publishable/secret key)");
  // Only live keys are configured for this account — test_mode must be false
  // or IntaSend will reject them against the sandbox host.
  return new IntaSend(pub, secret, false);
}

function pick(raw: unknown, paths: string[]): unknown {
  for (const path of paths) {
    let cur: unknown = raw;
    for (const key of path.split(".")) {
      if (cur && typeof cur === "object" && key in (cur as Record<string, unknown>)) {
        cur = (cur as Record<string, unknown>)[key];
      } else {
        cur = undefined;
        break;
      }
    }
    if (cur !== undefined && cur !== null) return cur;
  }
  return undefined;
}

function mapState(raw: unknown): ProviderStatus {
  const state = String(
    pick(raw, ["invoice.state", "state", "status", "invoice.status"]) ?? ""
  ).toUpperCase();
  if (["COMPLETE", "COMPLETED", "SUCCESS", "SUCCESSFUL", "PAID"].includes(state)) return "SUCCESSFUL";
  if (["FAILED", "FAILED_UNKNOWN"].includes(state)) return "FAILED";
  if (["CANCELLED", "CANCELED"].includes(state)) return "CANCELLED";
  if (["PROCESSING", "RETRY"].includes(state)) return "PROCESSING";
  return "PENDING"; // includes "PENDING" and any unrecognised state — never guess success
}

export const intasendProvider: PaymentProvider = {
  name: "INTASEND",
  supportedMethods: ["MPESA", "CARD"],

  async createCharge(input: ChargeInput): Promise<ChargeResult> {
    const intasend = client();
    const collection = intasend.collection();
    const [firstName, ...rest] = (input.name || "Techfind Customer").split(" ");
    const lastName = rest.join(" ") || "Customer";

    if (input.method === "MPESA") {
      if (!input.phone) throw new Error("Phone number is required for M-Pesa payments");
      const raw = await collection.mpesaStkPush({
        phone_number: input.phone.replace(/[^\d]/g, ""),
        name: input.name || "Techfind Customer",
        email: input.email || "customer@techfind.co.ke",
        amount: input.amount,
        api_ref: input.reference,
      });
      const gatewayReference = String(pick(raw, ["invoice.invoice_id", "invoice_id", "id"]) ?? input.reference);
      return { gatewayReference, status: mapState(raw), raw };
    }

    // CARD and anything else supported by IntaSend's hosted checkout.
    const raw = await collection.charge({
      first_name: firstName,
      last_name: lastName,
      email: input.email || "customer@techfind.co.ke",
      host: input.returnUrl ?? process.env.NEXT_PUBLIC_APP_URL,
      amount: input.amount,
      currency: input.currency,
      api_ref: input.reference,
    });
    const gatewayReference = String(pick(raw, ["invoice.invoice_id", "invoice_id", "id"]) ?? input.reference);
    const redirectUrl = pick(raw, ["url", "checkout_url"]) as string | undefined;
    return { gatewayReference, status: mapState(raw), redirectUrl, raw };
  },

  async checkStatus(gatewayReference: string): Promise<StatusResult> {
    const intasend = client();
    const raw = await intasend.collection().status(gatewayReference);
    const amount = Number(pick(raw, ["invoice.net_amount", "invoice.amount", "amount"]) ?? NaN);
    return { status: mapState(raw), amount: Number.isFinite(amount) ? amount : undefined, raw };
  },

  async refund(input: RefundInput) {
    const intasend = client();
    const raw = await intasend.refunds().create({
      invoice: input.gatewayReference,
      amount: input.amount,
      reason: "OTHER",
      reason_details: input.reason,
    });
    return { raw };
  },
};
