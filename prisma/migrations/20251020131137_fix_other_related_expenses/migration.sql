/*
  Warnings:

  - You are about to drop the column `Contract_Seller` on the `PropertyPost` table. All the data in the column will be lost.
  - You are about to drop the column `Deposit_Rent` on the `PropertyPost` table. All the data in the column will be lost.
  - You are about to drop the column `Interest` on the `PropertyPost` table. All the data in the column will be lost.
  - You are about to drop the column `Latitude` on the `PropertyPost` table. All the data in the column will be lost.
  - You are about to drop the column `Longitude` on the `PropertyPost` table. All the data in the column will be lost.
  - The `Other_related_expenses` column on the `PropertyPost` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PropertyPost" DROP COLUMN "Contract_Seller",
DROP COLUMN "Deposit_Rent",
DROP COLUMN "Interest",
DROP COLUMN "Latitude",
DROP COLUMN "Longitude",
DROP COLUMN "Other_related_expenses",
ADD COLUMN     "Other_related_expenses" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropEnum
DROP TYPE "public"."ContractStatus";

-- DropEnum
DROP TYPE "public"."FinancialReadiness";

-- DropEnum
DROP TYPE "public"."NegotiationStatus";
