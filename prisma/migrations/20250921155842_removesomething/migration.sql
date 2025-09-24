/*
  Warnings:

  - You are about to drop the column `negotiationId` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `DocumentUpload` table. All the data in the column will be lost.
  - You are about to drop the `Datetime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DocumentType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Negotiation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PropertyType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_negotiationId_fkey";

-- DropForeignKey
ALTER TABLE "Datetime" DROP CONSTRAINT "Datetime_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentUpload" DROP CONSTRAINT "DocumentUpload_typeId_fkey";

-- DropForeignKey
ALTER TABLE "Negotiation" DROP CONSTRAINT "Negotiation_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Negotiation" DROP CONSTRAINT "Negotiation_depositId_fkey";

-- DropForeignKey
ALTER TABLE "Negotiation" DROP CONSTRAINT "Negotiation_postId_fkey";

-- DropForeignKey
ALTER TABLE "Negotiation" DROP CONSTRAINT "Negotiation_sellerId_fkey";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "negotiationId";

-- AlterTable
ALTER TABLE "DocumentUpload" DROP COLUMN "typeId";

-- DropTable
DROP TABLE "Datetime";

-- DropTable
DROP TABLE "DocumentType";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "Negotiation";

-- DropTable
DROP TABLE "PropertyType";
