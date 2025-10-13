/*
  Warnings:

  - A unique constraint covering the columns `[propertyUnitId]` on the table `Deposit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `propertyUnitId` to the `Deposit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."Status_Review" ADD VALUE 'HIDDEN';

-- AlterTable
ALTER TABLE "public"."Deposit" ADD COLUMN     "propertyUnitId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_propertyUnitId_key" ON "public"."Deposit"("propertyUnitId");

-- AddForeignKey
ALTER TABLE "public"."Deposit" ADD CONSTRAINT "Deposit_propertyUnitId_fkey" FOREIGN KEY ("propertyUnitId") REFERENCES "public"."PropertyUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
