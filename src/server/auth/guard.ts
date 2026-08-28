import "server-only";
import { redirect } from "next/navigation";
import { getSessionUser, type SessionUser } from "./session";
import { can } from "./roles";
import type { Role } from "./roles";

/** Use in Server Components / layouts that require an authenticated user. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

/** Use in Server Actions / route handlers. Throws instead of redirecting. */
export async function requireUserOrThrow(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

export async function requirePermission(permission: Parameters<typeof can>[1]): Promise<SessionUser> {
  const user = await requireUserOrThrow();
  // Message is user-facing — several client components surface it directly via toast.error(e.message).
  if (!can(user.role, permission)) throw new Error("You don't have permission to do this.");
  return user;
}

export function isRole(user: SessionUser, ...roles: Role[]): boolean {
  return roles.includes(user.role);
}
