import type { PrismaClient, User } from "@prisma/client";

/**
 * Realistic Kenyan demo dataset (companies, contacts, leads, deals,
 * proformas, invoices, payments, projects, communications). Filled in
 * during Phase 8 — kept as a no-op stub until then so `prisma db seed`
 * stays runnable throughout earlier phases.
 */
export async function seedDemoData(_db: PrismaClient, _users: User[]) {
  // Intentionally empty for now — see /docs/ROADMAP.md Phase 8.
}
