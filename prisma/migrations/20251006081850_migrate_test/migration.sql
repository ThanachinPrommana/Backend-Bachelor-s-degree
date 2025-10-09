/*
  Warnings:

  - A unique constraint covering the columns `[propertyPostId,Unit_Number]` on the table `PropertyUnit` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Image" DROP CONSTRAINT "Image_propertyPostId_fkey";

-- AlterTable
ALTER TABLE "public"."PropertyPost" ADD COLUMN     "Deposit_Rent" DOUBLE PRECISION,
ALTER COLUMN "Nearby_Landmarks" SET DEFAULT ARRAY[]::"public"."Nearby_Landmarks_list"[],
ALTER COLUMN "Additional_Amenities" SET DEFAULT ARRAY[]::"public"."Additional_Amenities_list"[];

-- CreateIndex
CREATE INDEX "Booking_buyerId_createdAt_idx" ON "public"."Booking"("buyerId", "createdAt");

-- CreateIndex
CREATE INDEX "Booking_sellerId_createdAt_idx" ON "public"."Booking"("sellerId", "createdAt");

-- CreateIndex
CREATE INDEX "Booking_bookingStatus_createdAt_idx" ON "public"."Booking"("bookingStatus", "createdAt");

-- CreateIndex
CREATE INDEX "Buyer_userId_idx" ON "public"."Buyer"("userId");

-- CreateIndex
CREATE INDEX "DateTimeSlot_sellerId_startTime_idx" ON "public"."DateTimeSlot"("sellerId", "startTime");

-- CreateIndex
CREATE INDEX "DateTimeSlot_postId_startTime_idx" ON "public"."DateTimeSlot"("postId", "startTime");

-- CreateIndex
CREATE INDEX "DateTimeSlot_isBooked_idx" ON "public"."DateTimeSlot"("isBooked");

-- CreateIndex
CREATE INDEX "Deposit_userId_createdAt_idx" ON "public"."Deposit"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Deposit_postId_Deposit_Status_idx" ON "public"."Deposit"("postId", "Deposit_Status");

-- CreateIndex
CREATE INDEX "DocumentUpload_postId_idx" ON "public"."DocumentUpload"("postId");

-- CreateIndex
CREATE INDEX "DocumentUpload_userId_idx" ON "public"."DocumentUpload"("userId");

-- CreateIndex
CREATE INDEX "DocumentUpload_unitId_idx" ON "public"."DocumentUpload"("unitId");

-- CreateIndex
CREATE INDEX "Image_propertyPostId_idx" ON "public"."Image"("propertyPostId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_expiresAt_idx" ON "public"."PasswordResetToken"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "Payment_userId_createdAt_idx" ON "public"."Payment"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Payment_postId_Status_idx" ON "public"."Payment"("postId", "Status");

-- CreateIndex
CREATE INDEX "PropertyPost_sellerId_createdAt_idx" ON "public"."PropertyPost"("sellerId", "createdAt");

-- CreateIndex
CREATE INDEX "PropertyPost_userId_createdAt_idx" ON "public"."PropertyPost"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PropertyPost_Status_post_createdAt_idx" ON "public"."PropertyPost"("Status_post", "createdAt");

-- CreateIndex
CREATE INDEX "PropertyPost_Province_District_Subdistrict_idx" ON "public"."PropertyPost"("Province", "District", "Subdistrict");

-- CreateIndex
CREATE INDEX "PropertyUnit_propertyPostId_Status_idx" ON "public"."PropertyUnit"("propertyPostId", "Status");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyUnit_propertyPostId_Unit_Number_key" ON "public"."PropertyUnit"("propertyPostId", "Unit_Number");

-- CreateIndex
CREATE INDEX "Seller_userId_idx" ON "public"."Seller"("userId");

-- CreateIndex
CREATE INDEX "Seller_Status_idx" ON "public"."Seller"("Status");

-- CreateIndex
CREATE INDEX "Video_postId_idx" ON "public"."Video"("postId");

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_propertyPostId_fkey" FOREIGN KEY ("propertyPostId") REFERENCES "public"."PropertyPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
