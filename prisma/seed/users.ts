import type { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../src/server/auth/password";

export async function seedUsers(db: PrismaClient) {
  const defaultPassword = process.env.SEED_DEFAULT_PASSWORD ?? "techfind2026";
  const passwordHash = await hashPassword(defaultPassword);

  const team = [
    { email: "dennis@techfind.co.ke", name: "Dennis Kimani", role: "SUPER_ADMIN", phone: "+254712345001", avatarColor: "#6D28D9" },
    { email: "mercy@techfind.co.ke",  name: "Mercy Wanjiru", role: "MANAGEMENT",  phone: "+254712345002", avatarColor: "#2563EB" },
    { email: "brian@techfind.co.ke",  name: "Brian Otieno",  role: "SALES",       phone: "+254712345003", avatarColor: "#0F9D63" },
    { email: "faith@techfind.co.ke",  name: "Faith Njeri",   role: "SALES",       phone: "+254712345004", avatarColor: "#D97706" },
    { email: "kevin@techfind.co.ke",  name: "Kevin Mutua",   role: "FINANCE",     phone: "+254712345005", avatarColor: "#0891B2" },
    { email: "amina@techfind.co.ke",  name: "Amina Hassan",  role: "VIEWER",      phone: "+254712345006", avatarColor: "#64748B" },
  ];

  const users = [];
  for (const t of team) {
    const user = await db.user.upsert({
      where: { email: t.email },
      update: {},
      create: { ...t, passwordHash },
    });
    users.push(user);
  }

  console.log(`  Seeded ${users.length} users (default password: ${defaultPassword})`);
  return users;
}
