import "server-only";
import { db } from "@/server/db";
import { mockProvider } from "./mockProvider";
import { intasendProvider } from "./intasendProvider";
import type { PaymentProvider } from "./provider";

const PROVIDERS: Record<string, PaymentProvider> = {
  MOCK: mockProvider,
  INTASEND: intasendProvider,
};

/**
 * Resolves the active payment provider from Settings.
 *
 * Safety guard: IntaSend is configured with LIVE keys (real money). Outside
 * of production, this always resolves to the mock provider regardless of
 * the configured setting, so nothing run from a dev/test environment can
 * trigger a real M-Pesa prompt or card charge. Set
 * ALLOW_LIVE_PAYMENTS_IN_DEV=true to deliberately opt out when a real
 * end-to-end test is genuinely intended. See /docs/PAYMENTS.md.
 */
export async function getActiveProvider(): Promise<{ provider: PaymentProvider; configuredName: string; devSafetyOverride: boolean }> {
  const row = await db.setting.findUnique({ where: { key: "payment_provider" } });
  let configuredName = "MOCK";
  try {
    configuredName = row ? (JSON.parse(row.value).active ?? "MOCK") : "MOCK";
  } catch {
    configuredName = "MOCK";
  }

  const isProd = process.env.NODE_ENV === "production";
  const allowLiveInDev = process.env.ALLOW_LIVE_PAYMENTS_IN_DEV === "true";
  const devSafetyOverride = configuredName !== "MOCK" && !isProd && !allowLiveInDev;

  const resolvedName = devSafetyOverride ? "MOCK" : configuredName;
  return { provider: PROVIDERS[resolvedName] ?? mockProvider, configuredName, devSafetyOverride };
}

export function listProviderNames(): string[] {
  return Object.keys(PROVIDERS);
}

/**
 * Resolves the provider a specific payment was actually charged through
 * (`Payment.gateway`), for refunds — not "whatever's active now" (the
 * configured provider may have changed since the original charge).
 *
 * Same dev-safety intent as `getActiveProvider`, but refuses outright
 * rather than silently substituting the mock provider: a refund against a
 * live gateway reference silently "succeeding" against the mock store
 * would tell staff a customer was refunded when nothing happened.
 */
export function resolveProviderForRefund(gateway: string): PaymentProvider {
  const isProd = process.env.NODE_ENV === "production";
  const allowLiveInDev = process.env.ALLOW_LIVE_PAYMENTS_IN_DEV === "true";
  if (gateway !== "MOCK" && !isProd && !allowLiveInDev) {
    throw new Error("Refunding a live-gateway payment is blocked outside production (set ALLOW_LIVE_PAYMENTS_IN_DEV=true to override).");
  }
  const provider = PROVIDERS[gateway];
  if (!provider) throw new Error(`Unknown payment gateway "${gateway}".`);
  return provider;
}
