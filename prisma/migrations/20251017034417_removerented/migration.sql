/*
  Warnings:

  - The values [RENTED] on the enum `UnitStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UnitStatus_new" AS ENUM ('AVAILABLE', 'SOLD', 'PENDING');
ALTER TABLE "public"."PropertyUnit" ALTER COLUMN "Status" DROP DEFAULT;
ALTER TABLE "PropertyUnit" ALTER COLUMN "Status" TYPE "UnitStatus_new" USING ("Status"::text::"UnitStatus_new");
ALTER TYPE "UnitStatus" RENAME TO "UnitStatus_old";
ALTER TYPE "UnitStatus_new" RENAME TO "UnitStatus";
DROP TYPE "public"."UnitStatus_old";
ALTER TABLE "PropertyUnit" ALTER COLUMN "Status" SET DEFAULT 'AVAILABLE';
COMMIT;
