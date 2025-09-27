/*
  Warnings:

  - A unique constraint covering the columns `[propertyUnitId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `propertyUnitId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "propertyUnitId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_propertyUnitId_key" ON "public"."Booking"("propertyUnitId");

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_propertyUnitId_fkey" FOREIGN KEY ("propertyUnitId") REFERENCES "public"."PropertyUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
