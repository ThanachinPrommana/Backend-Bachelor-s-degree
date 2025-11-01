-- AlterTable
ALTER TABLE "DateTimeSlot" ADD COLUMN     "documentUploadId" TEXT;

-- AddForeignKey
ALTER TABLE "DateTimeSlot" ADD CONSTRAINT "DateTimeSlot_documentUploadId_fkey" FOREIGN KEY ("documentUploadId") REFERENCES "DocumentUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;
