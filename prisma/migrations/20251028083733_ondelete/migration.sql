-- DropForeignKey
ALTER TABLE "public"."DateTimeSlot" DROP CONSTRAINT "DateTimeSlot_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PropertyUnit" DROP CONSTRAINT "PropertyUnit_propertyPostId_fkey";

-- AddForeignKey
ALTER TABLE "PropertyUnit" ADD CONSTRAINT "PropertyUnit_propertyPostId_fkey" FOREIGN KEY ("propertyPostId") REFERENCES "PropertyPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "PropertyPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateTimeSlot" ADD CONSTRAINT "DateTimeSlot_postId_fkey" FOREIGN KEY ("postId") REFERENCES "PropertyPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
