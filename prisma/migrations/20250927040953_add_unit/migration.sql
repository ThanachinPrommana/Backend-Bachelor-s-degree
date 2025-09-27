-- CreateEnum
CREATE TYPE "public"."UnitStatus" AS ENUM ('AVAILABLE', 'SOLD', 'RENTED', 'PENDING');

-- AlterTable
ALTER TABLE "public"."DocumentUpload" ADD COLUMN     "unitId" TEXT;

-- CreateTable
CREATE TABLE "public"."PropertyUnit" (
    "id" TEXT NOT NULL,
    "Unit_Name" TEXT NOT NULL,
    "Status" "public"."UnitStatus" NOT NULL DEFAULT 'AVAILABLE',
    "propertyPostId" TEXT NOT NULL,

    CONSTRAINT "PropertyUnit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PropertyUnit" ADD CONSTRAINT "PropertyUnit_propertyPostId_fkey" FOREIGN KEY ("propertyPostId") REFERENCES "public"."PropertyPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentUpload" ADD CONSTRAINT "DocumentUpload_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."PropertyUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
