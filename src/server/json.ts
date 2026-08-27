/**
 * A handful of Prisma columns store small arrays/objects as JSON strings
 * (`productKeys`, `quickPrices`, `productsDiscussed`, `matchSuggestion`…).
 * SQLite has no native array/JSON column, and keeping these as plain
 * strings — rather than a side table — keeps the schema Postgres-portable
 * without a proliferation of tiny join tables for what are, in practice,
 * small denormalized lists. See /docs/DATABASE.md.
 */

export function toJson(value: unknown): string {
  return JSON.stringify(value ?? []);
}

export function parseJsonArray<T = string>(raw: string | null | undefined): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseJsonObject<T extends object>(raw: string | null | undefined): T | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? (parsed as T) : null;
  } catch {
    return null;
  }
}
