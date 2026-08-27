/** Shared money formatting — used server- and client-side, so no "server-only" guard. */

export function formatKES(amount: number, opts: { compact?: boolean } = {}): string {
  if (opts.compact) return `KES ${formatCompact(amount)}`;
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompact(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) return `${(amount / 1_000_000).toFixed(abs % 1_000_000 === 0 ? 0 : 2)}M`;
  if (abs >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return amount.toFixed(0);
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
