-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('Buyer', 'Seller', 'Admin');

-- CreateEnum
CREATE TYPE "public"."Status_Seller" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."Status_Disposit" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."Status_Review" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "public"."PaymentType" AS ENUM ('CREDIT_CARD', 'QR', 'STRIPE');

-- CreateEnum
CREATE TYPE "public"."Status_payment" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."NotificationStatus" AS ENUM ('UNREAD', 'READ');

-- CreateEnum
CREATE TYPE "public"."Nearby_Landmarks_list" AS ENUM ('BTS_MRT', 'School', 'Hospital', 'Mall_Market', 'Park');

-- CreateEnum
CREATE TYPE "public"."Additional_Amenities_list" AS ENUM ('Swimming_Pool', 'Fitness_Center', 'Co_working_Space', 'Pet_Friendly');

-- CreateEnum
CREATE TYPE "public"."Sell_Rent" AS ENUM ('SALE', 'RENT');

-- CreateEnum
CREATE TYPE "public"."Nearby_Facilities" AS ENUM ('BTS_MRT', 'School', 'Hospital', 'Mall_Market', 'Park_Nature');

-- CreateEnum
CREATE TYPE "public"."Parking_Needs" AS ENUM ('oneCar', 'twoCars', 'threePlus', 'Not_required');

-- CreateEnum
CREATE TYPE "public"."Lifestyle_Preferences" AS ENUM ('Work_from_Home', 'Have_Pets', 'Need_a_Home_Office', 'Like_Gardening');

-- CreateEnum
CREATE TYPE "public"."Status_post" AS ENUM ('PENDING', 'CONFIRMED', 'SOLD', 'HIDDEN', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'PENDING_FINAL_VERIFICATION', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."UnitStatus" AS ENUM ('AVAILABLE', 'SOLD', 'PENDING');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "First_name" TEXT NOT NULL,
    "Last_name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Phone" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "userType" "public"."UserType" NOT NULL DEFAULT 'Buyer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "publicId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Buyer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "DateofBirth" TIMESTAMP(3),
    "Occupation" TEXT,
    "Monthly_Income" DOUBLE PRECISION,
    "Family_Size" INTEGER,
    "Preferred_Province" TEXT,
    "Preferred_District" TEXT,
    "Preferred_Subdistrict" TEXT,
    "Parking_Needs" "public"."Parking_Needs",
    "Nearby_Facilities" "public"."Nearby_Facilities",
    "Lifestyle_Preferences" "public"."Lifestyle_Preferences",
    "Special_Requirements" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Seller" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "National_ID" TEXT NOT NULL,
    "Company_Name" TEXT,
    "RealEstate_License" TEXT,
    "Status" "public"."Status_Seller" NOT NULL DEFAULT 'PENDING',
    "StartTime" TIMESTAMP(3),
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "nationalIdImage" TEXT,
    "publicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PropertyPost" (
    "id" TEXT NOT NULL,
    "Property_Name" TEXT NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL,
    "Usable_Area" DOUBLE PRECISION NOT NULL,
    "Land_Size" DOUBLE PRECISION NOT NULL,
    "Bedrooms" INTEGER NOT NULL,
    "Bathroom" INTEGER NOT NULL,
    "Description" TEXT NOT NULL,
    "Deposit_Amount" DOUBLE PRECISION,
    "LinkMap" TEXT,
    "Province" TEXT NOT NULL,
    "District" TEXT NOT NULL,
    "Subdistrict" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "Total_Rooms" INTEGER,
    "Year_Built" TEXT,
    "Nearby_Landmarks" "public"."Nearby_Landmarks_list"[] DEFAULT ARRAY[]::"public"."Nearby_Landmarks_list"[],
    "Additional_Amenities" "public"."Additional_Amenities_list"[] DEFAULT ARRAY[]::"public"."Additional_Amenities_list"[],
    "Parking_Space" INTEGER,
    "Sell_Rent" "public"."Sell_Rent" NOT NULL,
    "Other_related_expenses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "Link_line" TEXT,
    "Link_facbook" TEXT,
    "Name" TEXT,
    "Phone" TEXT NOT NULL,
    "floor" INTEGER,
    "NumberOfUnits" INTEGER DEFAULT 1,
    "Status_post" "public"."Status_post" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "sellerId" TEXT,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PropertyUnit" (
    "id" TEXT NOT NULL,
    "Unit_Number" TEXT NOT NULL,
    "Status" "public"."UnitStatus" NOT NULL DEFAULT 'AVAILABLE',
    "propertyPostId" TEXT NOT NULL,

    CONSTRAINT "PropertyUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Deposit" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT,
    "Deposit_Status" "public"."Status_Disposit" NOT NULL,
    "Deposit_Amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyUnitId" TEXT NOT NULL,

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DocumentUpload" (
    "id" TEXT NOT NULL,
    "DocumentName" TEXT NOT NULL,
    "DocumentUrl" TEXT NOT NULL,
    "CloudinaryPublicId" TEXT,
    "Review_Status" "public"."Status_Review" NOT NULL,
    "Rejection_Note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "depositId" TEXT,
    "postId" TEXT,
    "unitId" TEXT,

    CONSTRAINT "DocumentUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "unitId" TEXT,
    "PaymentType" "public"."PaymentType" NOT NULL,
    "Payment_Amount" DOUBLE PRECISION NOT NULL,
    "Payment_Slip" TEXT NOT NULL,
    "Status" "public"."Status_payment" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "referenceId" TEXT,
    "Title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'general',
    "targetUrl" TEXT,
    "readAt" TIMESTAMP(3),
    "Message" TEXT NOT NULL,
    "Status" "public"."NotificationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "relatedProcess" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT,
    "public_id" TEXT,
    "url" TEXT NOT NULL,
    "secure_url" TEXT,
    "propertyPostId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PasswordResetToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Video" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT,
    "public_id" TEXT,
    "url" TEXT NOT NULL,
    "secure_url" TEXT,
    "postId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DateTimeSlot" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "sellerId" TEXT NOT NULL,
    "postId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DateTimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "dateTimeSlotId" TEXT NOT NULL,
    "isReminderSent" BOOLEAN NOT NULL DEFAULT false,
    "isDayOfAlertSent" BOOLEAN NOT NULL DEFAULT false,
    "isAtTimeAlertSent" BOOLEAN NOT NULL DEFAULT false,
    "finalSlipUrl" TEXT,
    "finalSlipUploadDate" TIMESTAMP(3),
    "bookingStatus" "public"."BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "propertyUnitId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "public"."User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_userId_key" ON "public"."Buyer"("userId");

-- CreateIndex
CREATE INDEX "Buyer_userId_idx" ON "public"."Buyer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_userId_key" ON "public"."Seller"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_National_ID_key" ON "public"."Seller"("National_ID");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_RealEstate_License_key" ON "public"."Seller"("RealEstate_License");

-- CreateIndex
CREATE INDEX "Seller_userId_idx" ON "public"."Seller"("userId");

-- CreateIndex
CREATE INDEX "Seller_Status_idx" ON "public"."Seller"("Status");

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
CREATE UNIQUE INDEX "Deposit_propertyUnitId_key" ON "public"."Deposit"("propertyUnitId");

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
CREATE INDEX "Payment_userId_createdAt_idx" ON "public"."Payment"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Payment_postId_Status_idx" ON "public"."Payment"("postId", "Status");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "public"."Notification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_Status_idx" ON "public"."Notification"("userId", "Status");

-- CreateIndex
CREATE INDEX "Image_propertyPostId_idx" ON "public"."Image"("propertyPostId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "public"."PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_expiresAt_idx" ON "public"."PasswordResetToken"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "Video_postId_idx" ON "public"."Video"("postId");

-- CreateIndex
CREATE INDEX "DateTimeSlot_sellerId_startTime_idx" ON "public"."DateTimeSlot"("sellerId", "startTime");

-- CreateIndex
CREATE INDEX "DateTimeSlot_postId_startTime_idx" ON "public"."DateTimeSlot"("postId", "startTime");

-- CreateIndex
CREATE INDEX "DateTimeSlot_isBooked_idx" ON "public"."DateTimeSlot"("isBooked");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_dateTimeSlotId_key" ON "public"."Booking"("dateTimeSlotId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_propertyUnitId_key" ON "public"."Booking"("propertyUnitId");

-- CreateIndex
CREATE INDEX "Booking_buyerId_createdAt_idx" ON "public"."Booking"("buyerId", "createdAt");

-- CreateIndex
CREATE INDEX "Booking_sellerId_createdAt_idx" ON "public"."Booking"("sellerId", "createdAt");

-- CreateIndex
CREATE INDEX "Booking_bookingStatus_createdAt_idx" ON "public"."Booking"("bookingStatus", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."Buyer" ADD CONSTRAINT "Buyer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Seller" ADD CONSTRAINT "Seller_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyPost" ADD CONSTRAINT "PropertyPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyPost" ADD CONSTRAINT "PropertyPost_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyPost" ADD CONSTRAINT "PropertyPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyUnit" ADD CONSTRAINT "PropertyUnit_propertyPostId_fkey" FOREIGN KEY ("propertyPostId") REFERENCES "public"."PropertyPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deposit" ADD CONSTRAINT "Deposit_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."PropertyPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deposit" ADD CONSTRAINT "Deposit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deposit" ADD CONSTRAINT "Deposit_propertyUnitId_fkey" FOREIGN KEY ("propertyUnitId") REFERENCES "public"."PropertyUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentUpload" ADD CONSTRAINT "DocumentUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentUpload" ADD CONSTRAINT "DocumentUpload_depositId_fkey" FOREIGN KEY ("depositId") REFERENCES "public"."Deposit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentUpload" ADD CONSTRAINT "DocumentUpload_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."PropertyPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentUpload" ADD CONSTRAINT "DocumentUpload_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."PropertyUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."PropertyPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."PropertyUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_propertyPostId_fkey" FOREIGN KEY ("propertyPostId") REFERENCES "public"."PropertyPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Video" ADD CONSTRAINT "Video_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."PropertyPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DateTimeSlot" ADD CONSTRAINT "DateTimeSlot_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DateTimeSlot" ADD CONSTRAINT "DateTimeSlot_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."PropertyPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "public"."Buyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_dateTimeSlotId_fkey" FOREIGN KEY ("dateTimeSlotId") REFERENCES "public"."DateTimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_propertyUnitId_fkey" FOREIGN KEY ("propertyUnitId") REFERENCES "public"."PropertyUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
