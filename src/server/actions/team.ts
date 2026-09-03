"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requirePermission } from "@/server/auth/guard";
import { writeAudit } from "@/server/audit";
import { hashPassword } from "@/server/auth/password";
import { AVATAR_COLORS } from "@/lib/os/avatarColors";
import { ROLES, type Role } from "@/server/auth/roles";

/**
 * No email/SMS provider exists in this app (see docs/PAYMENTS.md's "Forgot
 * Password" note for the same constraint) — so there's no invite-by-email
 * flow. Instead a Super Admin creates the account directly with a generated
 * temporary password, shown once, to hand to the new teammate themselves
 * (WhatsApp, in person, however). This is real account provisioning, not a
 * placeholder — the returned password is the one and only way to see it.
 */
function generateTempPassword(): string {
  return randomBytes(6).toString("base64url"); // 8 chars, url-safe
}

export interface CreateTeamMemberInput {
  name: string;
  email: string;
  phone?: string;
  role: Role;
}

export async function createTeamMemberAction(input: CreateTeamMemberInput): Promise<{ userId: string; tempPassword: string }> {
  const actor = await requirePermission("users.write");
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (!name) throw new Error("Name is required");
  if (!email || !email.includes("@")) throw new Error("A valid email is required");
  if (!ROLES.includes(input.role)) throw new Error("Invalid role");

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw new Error("A user with that email already exists");

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  const user = await db.user.create({
    data: {
      name,
      email,
      phone: input.phone?.trim() || null,
      role: input.role,
      passwordHash,
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    },
  });

  await writeAudit({ actorId: actor.id, action: "CREATE_TEAM_MEMBER", entityType: "User", entityId: user.id, after: { name, email, role: input.role } });
  revalidatePath("/app/settings");
  return { userId: user.id, tempPassword };
}

export async function updateTeamMemberAction(userId: string, input: { name: string; phone: string; role: Role }): Promise<void> {
  const actor = await requirePermission("users.write");
  const name = input.name.trim();
  if (!name) throw new Error("Name can't be empty");
  if (!ROLES.includes(input.role)) throw new Error("Invalid role");
  if (userId === actor.id && input.role !== actor.role) throw new Error("You can't change your own role");

  const before = await db.user.findUnique({ where: { id: userId } });
  if (!before) throw new Error("User not found");

  const updated = await db.user.update({
    where: { id: userId },
    data: { name, phone: input.phone.trim() || null, role: input.role },
  });

  await writeAudit({ actorId: actor.id, action: "UPDATE_TEAM_MEMBER", entityType: "User", entityId: userId, before, after: updated });
  revalidatePath("/app/settings");
}

export async function setTeamMemberActiveAction(userId: string, active: boolean): Promise<void> {
  const actor = await requirePermission("users.write");
  if (userId === actor.id && !active) throw new Error("You can't deactivate your own account");

  const before = await db.user.findUnique({ where: { id: userId } });
  if (!before) throw new Error("User not found");

  const updated = await db.user.update({ where: { id: userId }, data: { active } });
  if (!active) {
    // Kill any live sessions immediately rather than waiting for their next request to be rejected.
    await db.session.deleteMany({ where: { userId } });
  }

  await writeAudit({ actorId: actor.id, action: active ? "REACTIVATE_TEAM_MEMBER" : "DEACTIVATE_TEAM_MEMBER", entityType: "User", entityId: userId, before, after: updated });
  revalidatePath("/app/settings");
}

export async function resetTeamMemberPasswordAction(userId: string): Promise<{ tempPassword: string }> {
  const actor = await requirePermission("users.write");
  const before = await db.user.findUnique({ where: { id: userId } });
  if (!before) throw new Error("User not found");

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);
  await db.user.update({ where: { id: userId }, data: { passwordHash } });
  await db.session.deleteMany({ where: { userId } }); // force re-login with the new password

  await writeAudit({ actorId: actor.id, action: "RESET_TEAM_MEMBER_PASSWORD", entityType: "User", entityId: userId });
  return { tempPassword };
}
