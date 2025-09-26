/*
  Warnings:

  - You are about to drop the column `propertyPostId` on the `Seller` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Seller" DROP CONSTRAINT "Seller_propertyPostId_fkey";

-- AlterTable
ALTER TABLE "PropertyPost" ADD COLUMN     "sellerId" TEXT;

-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "propertyPostId";

-- AddForeignKey
ALTER TABLE "PropertyPost" ADD CONSTRAINT "PropertyPost_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;
