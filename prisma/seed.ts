import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seed/users";
import { seedCatalogue } from "./seed/catalogue";
import { seedSettings } from "./seed/settings";
import { seedDemoData } from "./seed/demo";

const db = new PrismaClient();

async function main() {
  console.log("Seeding Techfind Revenue OS...");
  const users = await seedUsers(db);
  await seedCatalogue(db);
  await seedSettings(db);
  await seedDemoData(db, users);
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
