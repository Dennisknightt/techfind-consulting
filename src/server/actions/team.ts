"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requireUserOrThrow, requirePermission } from "@/server/auth/guard";
import { hashPassword } from "@/server/auth/password";
import { writeAudit } from "@/server/audit";
import { ROLES, type Role } from "@/server/auth/roles";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  active: boolean;
  createdAt: string;
}

function serialize(u: {
  id: string; name: string; email: string; role: string; phone: string | null; active: boolean; createdAt: Date;
}): TeamMember {
  return { id: u.id, name: u.name, email: u.email, role: u.role as Role, phone: u.phone, active: u.active, createdAt: u.createdAt.toISOString() };
}

function generateTempPassword(): string {
  return randomBytes(9).toString("base64url"); // 12 url-safe chars
}

/** How many OTHER active Super Admins exist besides the given user. */
async function otherActiveSuperAdmins(excludeUserId: string): Promise<number> {
  return db.user.count({ where: { role: "SUPER_ADMIN", active: true, id: { not: excludeUserId } } });
}

export async function listTeamAction(): Promise<TeamMember[]> {
  await requireUserOrThrow();
  const users = await db.user.findMany({ orderBy: { createdAt: "asc" } });
  return users.map(serialize);
}

export interface CreateTeamMemberResult {
  error?: string;
  member?: TeamMember;
  tempPassword?: string;
}

/**
 * There's no email-sending in this app yet (see docs/INTEGRATIONS.md) — a
 * "send an invite link" flow would only look like it worked. Instead this
 * generates a temporary password and hands it back once, for the admin to
 * share out of band, the same way the seeded team's own passwords work.
 */
export async function createTeamMemberAction(input: {
  name: string;
  email: string;
  role: string;
  phone?: string;
}): Promise<CreateTeamMemberResult> {
  const actor = await requirePermission("users.write");

  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const role = input.role as Role;

  if (!name) return { error: "Name is required." };
  if (!email || !email.includes("@")) return { error: "A valid email is required." };
  if (!ROLES.includes(role)) return { error: "Invalid role." };

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { error: "A user with this email already exists." };

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  const user = await db.user.create({
    data: { name, email, role, phone: input.phone?.trim() || undefined, passwordHash },
  });

  await writeAudit({
    actorId: actor.id, action: "TEAM_MEMBER_CREATED", entityType: "User", entityId: user.id,
    after: { name, email, role },
  });
  revalidatePath("/app/settings");

  return { member: serialize(user), tempPassword };
}

export interface TeamMutationResult {
  error?: string;
}

export async function updateTeamMemberRoleAction(userId: string, role: string): Promise<TeamMutationResult> {
  const actor = await requirePermission("users.write");
  if (!ROLES.includes(role as Role)) return { error: "Invalid role." };

  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target) return { error: "User not found." };

  if (target.active && target.role === "SUPER_ADMIN" && role !== "SUPER_ADMIN") {
    const others = await otherActiveSuperAdmins(target.id);
    if (others === 0) return { error: "This is the only active Super Admin — promote someone else first." };
  }

  await db.user.update({ where: { id: userId }, data: { role } });
  await writeAudit({
    actorId: actor.id, action: "TEAM_MEMBER_ROLE_CHANGED", entityType: "User", entityId: userId,
    before: { role: target.role }, after: { role },
  });
  revalidatePath("/app/settings");
  return {};
}

export async function setTeamMemberActiveAction(userId: string, active: boolean): Promise<TeamMutationResult> {
  const actor = await requirePermission("users.write");
  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target) return { error: "User not found." };

  if (!active) {
    if (target.id === actor.id) return { error: "You can't deactivate your own account." };
    if (target.role === "SUPER_ADMIN") {
      const others = await otherActiveSuperAdmins(target.id);
      if (others === 0) return { error: "This is the only active Super Admin — promote someone else before deactivating this account." };
    }
  }

  await db.user.update({ where: { id: userId }, data: { active } });
  await writeAudit({
    actorId: actor.id,
    action: active ? "TEAM_MEMBER_REACTIVATED" : "TEAM_MEMBER_DEACTIVATED",
    entityType: "User", entityId: userId,
    before: { active: target.active }, after: { active },
  });
  revalidatePath("/app/settings");
  return {};
}

export interface ResetPasswordResult {
  error?: string;
  tempPassword?: string;
}

export async function resetTeamMemberPasswordAction(userId: string): Promise<ResetPasswordResult> {
  const actor = await requirePermission("users.write");
  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target) return { error: "User not found." };

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);
  await db.user.update({ where: { id: userId }, data: { passwordHash } });

  // A password reset should also end whatever session(s) the old password
  // protected — otherwise a device that's already logged in stays logged
  // in on the credential that was just invalidated.
  await db.session.deleteMany({ where: { userId } });

  await writeAudit({ actorId: actor.id, action: "TEAM_MEMBER_PASSWORD_RESET", entityType: "User", entityId: userId });
  return { tempPassword };
}
