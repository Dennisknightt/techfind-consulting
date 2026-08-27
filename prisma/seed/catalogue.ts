import type { PrismaClient } from "@prisma/client";

const PRODUCTS = [
  // ── Websites ──
  { key: "website",        category: "WEBSITE", name: "Business Website", isQuickChip: true,  quickPrices: [100_000, 125_000, 150_000, 200_000] },
  { key: "ecommerce",      category: "WEBSITE", name: "E-commerce",       isQuickChip: false, quickPrices: [] },
  { key: "customer-portal", category: "WEBSITE", name: "Customer Portal", isQuickChip: false, quickPrices: [] },

  // ── WhatsApp ──
  { key: "whatsapp",           category: "WHATSAPP", name: "WhatsApp Automation",           isQuickChip: true,  quickPrices: [50_000, 75_000, 100_000, 125_000] },
  { key: "whatsapp-lead-qual", category: "WHATSAPP", name: "Lead Qualification",             isQuickChip: false, quickPrices: [] },
  { key: "whatsapp-booking",   category: "WHATSAPP", name: "Booking Automation",             isQuickChip: false, quickPrices: [] },
  { key: "whatsapp-support",   category: "WHATSAPP", name: "Customer Support Automation",    isQuickChip: false, quickPrices: [] },

  // ── Business Systems ──
  { key: "crm",           category: "BUSINESS_SYSTEMS", name: "CRM",                    isQuickChip: true,  quickPrices: [125_000, 150_000, 200_000, 250_000] },
  { key: "inventory",     category: "BUSINESS_SYSTEMS", name: "Inventory",               isQuickChip: true,  quickPrices: [100_000, 150_000, 200_000, 300_000] },
  { key: "pos",           category: "BUSINESS_SYSTEMS", name: "POS",                     isQuickChip: true,  quickPrices: [100_000, 150_000, 200_000, 280_000] },
  { key: "booking",       category: "BUSINESS_SYSTEMS", name: "Booking",                 isQuickChip: true,  quickPrices: [80_000, 120_000, 180_000, 250_000] },
  { key: "manufacturing", category: "BUSINESS_SYSTEMS", name: "Manufacturing",           isQuickChip: false, quickPrices: [] },
  { key: "distribution",  category: "BUSINESS_SYSTEMS", name: "Distribution",            isQuickChip: false, quickPrices: [] },
  { key: "operations",    category: "BUSINESS_SYSTEMS", name: "Operations Management",   isQuickChip: false, quickPrices: [] },

  // ── AI ──
  { key: "ai",                   category: "AI", name: "AI",                      isQuickChip: true,  quickPrices: [80_000, 120_000, 180_000, 250_000] },
  { key: "ai-support",           category: "AI", name: "AI Customer Support",      isQuickChip: false, quickPrices: [] },
  { key: "ai-lead-qualification", category: "AI", name: "AI Lead Qualification",   isQuickChip: false, quickPrices: [] },
  { key: "ai-bi",                category: "AI", name: "AI Business Intelligence", isQuickChip: false, quickPrices: [] },

  // ── Services ──
  { key: "integration",  category: "SERVICES", name: "Integration",         isQuickChip: true,  quickPrices: [30_000, 50_000, 80_000, 120_000] },
  { key: "hosting",      category: "SERVICES", name: "Hosting",             isQuickChip: true,  quickPrices: [3_000, 5_000, 8_000, 15_000], isRecurring: true },
  { key: "maintenance",  category: "SERVICES", name: "Maintenance",         isQuickChip: true,  quickPrices: [5_000, 7_000, 10_000, 15_000], isRecurring: true },
  { key: "development",  category: "SERVICES", name: "Custom Development", isQuickChip: false, quickPrices: [] },
  { key: "custom",       category: "SERVICES", name: "Custom",              isQuickChip: true,  quickPrices: [] },
];

export async function seedCatalogue(db: PrismaClient) {
  for (const [i, p] of PRODUCTS.entries()) {
    await db.product.upsert({
      where: { key: p.key },
      update: {},
      create: {
        key: p.key,
        category: p.category,
        name: p.name,
        isQuickChip: p.isQuickChip,
        isRecurring: p.isRecurring ?? false,
        quickPrices: JSON.stringify(p.quickPrices),
        sortOrder: i,
      },
    });
  }
  console.log(`  Seeded ${PRODUCTS.length} catalogue products`);

  const quickItems = [
    { label: "Website — 150K",     productKeys: ["website"],            totalPrice: 150_000 },
    { label: "WhatsApp — 50K",     productKeys: ["whatsapp"],           totalPrice: 50_000 },
    { label: "CRM — 150K",         productKeys: ["crm"],                totalPrice: 150_000 },
    { label: "Website + WA — 200K", productKeys: ["website", "whatsapp"], totalPrice: 200_000 },
    { label: "CRM + WA — 200K",    productKeys: ["crm", "whatsapp"],    totalPrice: 200_000 },
    { label: "Maintenance — 7K/mo", productKeys: ["maintenance"],       totalPrice: 7_000, recurring: true },
  ];
  for (const [i, q] of quickItems.entries()) {
    const existing = await db.quickItem.findFirst({ where: { label: q.label, global: true } });
    if (!existing) {
      await db.quickItem.create({
        data: {
          label: q.label,
          productKeys: JSON.stringify(q.productKeys),
          totalPrice: q.totalPrice,
          recurring: q.recurring ?? false,
          global: true,
          sortOrder: i,
        },
      });
    }
  }
  console.log(`  Seeded ${quickItems.length} quick items`);

  const packages = [
    { name: "Digital Starter",     description: "Website + WhatsApp Automation",        productKeys: ["website", "whatsapp"], price: 200_000 },
    { name: "Business Automation", description: "WhatsApp + CRM + Integration",         productKeys: ["whatsapp", "crm", "integration"], price: 250_000 },
    { name: "Full Stack Launch",   description: "Website + CRM + WhatsApp + Hosting",   productKeys: ["website", "crm", "whatsapp", "hosting"], price: 380_000 },
  ];
  for (const [i, p] of packages.entries()) {
    const existing = await db.package.findFirst({ where: { name: p.name } });
    if (!existing) {
      await db.package.create({
        data: { name: p.name, description: p.description, productKeys: JSON.stringify(p.productKeys), price: p.price, sortOrder: i },
      });
    }
  }
  console.log(`  Seeded ${packages.length} packages`);
}
