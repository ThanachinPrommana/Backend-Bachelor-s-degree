
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const categories = [
  { id: "cmegzfdya0006w2bwq5d8alc7", name: "condo" },
  { id: "cmegzfhx70007w2bwp63cbc1w", name: "house" },
  { id: "cmegzfls20008w2bwf0arh8jq", name: "land" },
  { id: "cmegzfov30009w2bwrxjpt7xn", name: "villa" },
  { id: "cmegzft08000aw2bwx91l68z9", name: "townhouse" },
  { id: "cmegzg3t1000cw2bw8shu6whw", name: "shop house" },
  { id: "cmegzg9ez000dw2bwgkdliy1a", name: "apartment" },
  { id: "cmegzgcmy000ew2bw72nen7zo", name: "penthouse" },
  { id: "cmegzgfvz000fw2bwgppl0ci5", name: "resort" },
  { id: "cmegzgif1000gw2bw1z7xda7u", name: "hotel" },
  { id: "cmegzgky4000hw2bwe83xrvrg", name: "office" },
  { id: "cmegzgq6g000iw2bwl51st9pg", name: "commercial building" },
  { id: "cmegzgu1s000jw2bwdhco4e1r", name: "factory" },
  { id: "cmegzgxsj000kw2bwebelhpmm", name: "warehouse" }
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