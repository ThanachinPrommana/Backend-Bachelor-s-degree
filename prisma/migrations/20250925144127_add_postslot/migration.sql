-- AlterTable
ALTER TABLE "DateTimeSlot" ADD COLUMN     "postId" TEXT;

-- AddForeignKey
ALTER TABLE "DateTimeSlot" ADD CONSTRAINT "DateTimeSlot_postId_fkey" FOREIGN KEY ("postId") REFERENCES "PropertyPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
