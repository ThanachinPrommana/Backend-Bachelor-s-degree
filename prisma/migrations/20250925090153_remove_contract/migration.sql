/*
  Warnings:

  - You are about to drop the `Contract` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'PENDING_FINAL_VERIFICATION', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_userId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "bookingStatus" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
ADD COLUMN     "finalSlipUploadDate" TIMESTAMP(3),
ADD COLUMN     "finalSlipUrl" TEXT;

-- DropTable
DROP TABLE "Contract";
