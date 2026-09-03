import "server-only";
import { getSessionUser, type SessionUser } from "@/server/auth/session";

/**
 * Shared guard for the marketing site's admin-only endpoints (lead
 * export/management, communications). Fails CLOSED: no session, an
 * inactive user, or any role other than SUPER_ADMIN all mean "no access" —
 * matches the check the /admin page itself enforces in its layout.
 */
export async function requireAdminUser(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  if (!user || user.role !== "SUPER_ADMIN") return null;
  return user;
}
