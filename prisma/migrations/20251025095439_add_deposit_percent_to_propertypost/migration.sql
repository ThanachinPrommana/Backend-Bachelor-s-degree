/*
  Warnings:

  - The values [RENTED] on the enum `UnitStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."UnitStatus_new" AS ENUM ('AVAILABLE', 'SOLD', 'PENDING');
ALTER TABLE "public"."PropertyUnit" ALTER COLUMN "Status" DROP DEFAULT;
ALTER TABLE "public"."PropertyUnit" ALTER COLUMN "Status" TYPE "public"."UnitStatus_new" USING ("Status"::text::"public"."UnitStatus_new");
ALTER TYPE "public"."UnitStatus" RENAME TO "UnitStatus_old";
ALTER TYPE "public"."UnitStatus_new" RENAME TO "UnitStatus";
DROP TYPE "public"."UnitStatus_old";
ALTER TABLE "public"."PropertyUnit" ALTER COLUMN "Status" SET DEFAULT 'AVAILABLE';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "unitId" TEXT;

-- AlterTable
ALTER TABLE "public"."PropertyPost" ADD COLUMN     "Deposit_Percent" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."PropertyUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
