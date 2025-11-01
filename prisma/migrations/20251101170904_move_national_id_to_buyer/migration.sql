/*
  Warnings:

  - You are about to drop the column `National_ID` on the `Seller` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[National_ID]` on the table `Buyer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `National_ID` to the `Buyer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Seller_National_ID_key";

-- AlterTable
ALTER TABLE "public"."Buyer" ADD COLUMN     "National_ID" TEXT NOT NULL,
ADD COLUMN     "Reg_Alley" TEXT,
ADD COLUMN     "Reg_District" TEXT,
ADD COLUMN     "Reg_HouseNo" TEXT,
ADD COLUMN     "Reg_Province" TEXT,
ADD COLUMN     "Reg_Road" TEXT,
ADD COLUMN     "Reg_Subdistrict" TEXT,
ADD COLUMN     "Reg_Village" TEXT;

-- AlterTable
ALTER TABLE "public"."Seller" DROP COLUMN "National_ID";

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_National_ID_key" ON "public"."Buyer"("National_ID");
