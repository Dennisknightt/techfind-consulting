import type { NextRequest } from "next/server";
import { cfg } from "@/lib/config";

/**
 * Shared guard for the marketing site's admin-only endpoints (lead
 * export/management, communications). Fails CLOSED: if ADMIN_SECRET isn't
 * configured, every request is rejected rather than the check being
 * silently skipped — an unset secret must never mean "open to anyone."
 */
export function isAuthorizedAdmin(req: NextRequest): boolean {
  const token = req.headers.get("x-admin-token") ?? req.nextUrl.searchParams.get("token") ?? "";
  const expected = cfg.admin.secret;
  return Boolean(expected) && token === expected;
}
