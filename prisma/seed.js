
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const categories = [
  { id: "cmegzfdya0006w2bwq5d8alc7", name: "condo" },
  { id: "cmegzfhx70007w2bwp63cbc1w", name: "house" },
  { id: "cmegzfov30009w2bwrxjpt7xn", name: "villa" },
  { id: "cmegzft08000aw2bwx91l68z9", name: "townhouse" },
];

async function main() {
  console.log('Start seeding categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });