import type { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../src/server/auth/password";

export async function seedUsers(db: PrismaClient) {
  const defaultPassword = process.env.SEED_DEFAULT_PASSWORD ?? "techfind2026";
  const passwordHash = await hashPassword(defaultPassword);

  // Techfind runs as a single-operator account — no fictional team roster.
  const team = [
    { email: "dennis@techfind.co.ke", name: "Dennis Knightt", role: "SUPER_ADMIN", phone: "+254712345001", avatarColor: "#6D28D9" },
  ];

  const users = [];
  for (const t of team) {
    const user = await db.user.upsert({
      where: { email: t.email },
      update: { name: t.name, role: t.role, phone: t.phone, avatarColor: t.avatarColor },
      create: { ...t, passwordHash },
    });
    users.push(user);
  }

  // Remove any previously seeded team member that isn't in the roster above —
  // upserts only ever add/update, so a shrinking roster needs an explicit sweep.
  const keepEmails = team.map(t => t.email);
  const removed = await db.user.deleteMany({ where: { email: { notIn: keepEmails } } });
  if (removed.count > 0) console.log(`  Removed ${removed.count} user(s) no longer in the roster`);

  console.log(`  Seeded ${users.length} user(s) (default password: ${defaultPassword})`);
  return users;
}
