/*
  Warnings:

  - A unique constraint covering the columns `[bookingId]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingId` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "bookingId" TEXT NOT NULL,
ALTER COLUMN "BuyerContractDoc" DROP NOT NULL,
ALTER COLUMN "BuyerUploadDate" DROP NOT NULL,
ALTER COLUMN "SellerContractDoc" DROP NOT NULL,
ALTER COLUMN "SellerUploadDate" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Contract_bookingId_key" ON "Contract"("bookingId");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
