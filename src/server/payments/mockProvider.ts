import "server-only";
import { randomBytes } from "crypto";
import type { PaymentProvider, ChargeInput, ChargeResult, StatusResult, RefundInput } from "./provider";

/**
 * Sandbox provider — no external calls, no real money. Simulates the full
 * gateway lifecycle deterministically (PENDING → SUCCESSFUL a moment later)
 * so the entire commercial chain — proforma → pay → webhook → reconciled —
 * is genuinely clickable without live credentials. This is the default
 * provider in every environment except production.
 */

declare global {
  var __mockGatewayStore: Map<string, { status: string; amount: number; createdAt: number }> | undefined;
}

function store() {
  if (!globalThis.__mockGatewayStore) globalThis.__mockGatewayStore = new Map();
  return globalThis.__mockGatewayStore;
}

const SETTLE_AFTER_MS = 2500;

export const mockProvider: PaymentProvider = {
  name: "MOCK",
  supportedMethods: ["MPESA", "CARD", "BANK_TRANSFER"],

  async createCharge(input: ChargeInput): Promise<ChargeResult> {
    const gatewayReference = `MOCK-${randomBytes(6).toString("hex").toUpperCase()}`;
    store().set(gatewayReference, { status: "PENDING", amount: input.amount, createdAt: Date.now() });
    return {
      gatewayReference,
      status: "PENDING",
      raw: { simulated: true, method: input.method, reference: input.reference, amount: input.amount },
    };
  },

  async checkStatus(gatewayReference: string): Promise<StatusResult> {
    const entry = store().get(gatewayReference);
    if (!entry) return { status: "FAILED", raw: { simulated: true, error: "unknown reference" } };
    if (Date.now() - entry.createdAt > SETTLE_AFTER_MS && entry.status === "PENDING") {
      entry.status = "SUCCESSFUL";
      store().set(gatewayReference, entry);
    }
    return { status: entry.status as StatusResult["status"], amount: entry.amount, raw: { simulated: true, ...entry } };
  },

  async refund(input: RefundInput) {
    return { raw: { simulated: true, refunded: input.amount, reference: input.gatewayReference } };
  },
};
