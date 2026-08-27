import "server-only";

/**
 * PaymentProvider — the abstraction the rest of the app codes against.
 * Techfind should never be hardwired to one gateway; a new provider is a
 * new file implementing this interface, registered in registry.ts. See
 * /docs/PAYMENTS.md.
 */

export type PaymentMethod = "MPESA" | "CARD" | "BANK_TRANSFER" | "PESALINK" | "OTHER";
export type ProviderStatus = "PENDING" | "PROCESSING" | "SUCCESSFUL" | "FAILED" | "CANCELLED";

export interface ChargeInput {
  amount: number;
  currency: string;
  method: PaymentMethod;
  reference: string; // our idempotency/api_ref, e.g. the PaymentSession token
  phone?: string;
  email?: string;
  name?: string;
  /** Where the customer lands after a hosted checkout (CARD-style methods). */
  returnUrl?: string;
}

export interface ChargeResult {
  gatewayReference: string;
  status: ProviderStatus;
  /** Present for hosted-checkout style methods — redirect the customer here. */
  redirectUrl?: string;
  raw: unknown;
}

export interface StatusResult {
  status: ProviderStatus;
  amount?: number;
  raw: unknown;
}

export interface RefundInput {
  gatewayReference: string;
  amount: number;
  reason: string;
}

export interface PaymentProvider {
  readonly name: string;
  readonly supportedMethods: PaymentMethod[];
  createCharge(input: ChargeInput): Promise<ChargeResult>;
  checkStatus(gatewayReference: string): Promise<StatusResult>;
  refund(input: RefundInput): Promise<{ raw: unknown }>;
}
