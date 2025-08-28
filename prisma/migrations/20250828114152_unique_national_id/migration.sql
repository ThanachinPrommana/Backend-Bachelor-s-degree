/*
  Warnings:

  - A unique constraint covering the columns `[National_ID]` on the table `Seller` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[RealEstate_License]` on the table `Seller` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Seller" ALTER COLUMN "Company_Name" DROP NOT NULL,
ALTER COLUMN "RealEstate_License" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Seller_National_ID_key" ON "Seller"("National_ID");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_RealEstate_License_key" ON "Seller"("RealEstate_License");
