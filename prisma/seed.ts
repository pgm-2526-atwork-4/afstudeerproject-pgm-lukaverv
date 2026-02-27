import "dotenv/config";
import { prisma } from "../server/utils/db";
import { seedBeats } from "./seeds/beat.seed";

async function main() {
  await seedBeats();
}

main()
  .then(() => {
    console.log("✅ Seeding completed successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
