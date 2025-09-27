-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_propertyUnitId_fkey";

-- AlterTable
ALTER TABLE "public"."Booking" ALTER COLUMN "propertyUnitId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_propertyUnitId_fkey" FOREIGN KEY ("propertyUnitId") REFERENCES "public"."PropertyUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
