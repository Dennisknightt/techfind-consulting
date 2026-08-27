import type { PrismaClient } from "@prisma/client";

export async function seedSettings(db: PrismaClient) {
  const defaults: Record<string, unknown> = {
    tax_config: { mode: "EXCLUSIVE", rate: 16, label: "VAT" },
    payment_provider: { active: "INTASEND" },
    currency: { code: "KES", symbol: "KES" },
  };

  for (const [key, value] of Object.entries(defaults)) {
    await db.setting.upsert({
      where: { key },
      update: {},
      create: { key, value: JSON.stringify(value) },
    });
  }
  console.log(`  Seeded ${Object.keys(defaults).length} settings`);
}
