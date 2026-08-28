import "server-only";
import { headers } from "next/headers";
import { db } from "@/server/db";

/**
 * Writes an immutable audit trail entry. Financial and commercial mutations
 * (payments, documents, stage/status changes) should always call this —
 * see /docs/SECURITY.md. Never throws into the caller; audit failures are
 * logged but must not block the underlying action.
 */
export async function writeAudit(input: {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  before?: unknown;
  after?: unknown;
}): Promise<void> {
  try {
    const h = await headers();
    await db.auditLog.create({
      data: {
        actorId: input.actorId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        before: input.before !== undefined ? JSON.stringify(input.before) : null,
        after: input.after !== undefined ? JSON.stringify(input.after) : null,
        ip: h.get("x-forwarded-for") ?? undefined,
      },
    });
  } catch (err) {
    console.error("[audit] failed to write entry:", err);
  }
}
