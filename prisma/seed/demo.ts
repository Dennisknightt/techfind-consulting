import type { PrismaClient, User } from "@prisma/client";

/**
 * Demo/sample data generation is intentionally not run in this environment —
 * the app ships with users, the product catalogue and settings only, and
 * starts genuinely empty otherwise. Kept as a no-op so `prisma db seed`
 * stays runnable without populating fictional companies, deals or payments.
 */
export async function seedDemoData(_db: PrismaClient, _users: User[]) {
  // Intentionally empty — no demo/sample business data is seeded.
}
