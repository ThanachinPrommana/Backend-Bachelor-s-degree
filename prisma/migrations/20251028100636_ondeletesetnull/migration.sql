-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_propertyUnitId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Deposit" DROP CONSTRAINT "Deposit_propertyUnitId_fkey";

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_propertyUnitId_fkey" FOREIGN KEY ("propertyUnitId") REFERENCES "PropertyUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_propertyUnitId_fkey" FOREIGN KEY ("propertyUnitId") REFERENCES "PropertyUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
