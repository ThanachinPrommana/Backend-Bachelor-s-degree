-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Buyer', 'Seller', 'Admin');

-- CreateEnum
CREATE TYPE "Status_Seller" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Status_Disposit" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Status_Review" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CREDIT_CARD', 'QR', 'STRIPE');

-- CreateEnum
CREATE TYPE "Status_payment" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ');

-- CreateEnum
CREATE TYPE "Nearby_Landmarks_list" AS ENUM ('BTS_MRT', 'School', 'Hospital', 'Mall_Market', 'Park');

-- CreateEnum
CREATE TYPE "Additional_Amenities_list" AS ENUM ('Swimming_Pool', 'Fitness_Center', 'Co_working_Space', 'Pet_Friendly');

-- CreateEnum
CREATE TYPE "Sell_Rent" AS ENUM ('SALE', 'RENT');

-- CreateEnum
CREATE TYPE "Nearby_Facilities" AS ENUM ('BTS_MRT', 'School', 'Hospital', 'Mall_Market', 'Park_Nature');

-- CreateEnum
CREATE TYPE "Parking_Needs" AS ENUM ('oneCar', 'twoCars', 'threePlus', 'Not_required');

-- CreateEnum
CREATE TYPE "Lifestyle_Preferences" AS ENUM ('Work_from_Home', 'Have_Pets', 'Need_a_Home_Office', 'Like_Gardening');

-- CreateEnum
CREATE TYPE "Status_post" AS ENUM ('PENDING', 'CONFIRMED', 'SOLD', 'HIDDEN', 'REJECTED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'PENDING_FINAL_VERIFICATION', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "UnitStatus" AS ENUM ('AVAILABLE', 'SOLD', 'PENDING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "First_name" TEXT NOT NULL,
    "Last_name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Phone" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "userType" "UserType" NOT NULL DEFAULT 'Buyer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "publicId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buyer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "DateofBirth" TIMESTAMP(3),
    "Occupation" TEXT,
    "Monthly_Income" DOUBLE PRECISION,
    "Family_Size" INTEGER,
    "Preferred_Province" TEXT,
    "Preferred_District" TEXT,
    "Preferred_Subdistrict" TEXT,
    "Parking_Needs" "Parking_Needs",
    "Nearby_Facilities" "Nearby_Facilities",
    "Lifestyle_Preferences" "Lifestyle_Preferences",
    "Special_Requirements" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "National_ID" TEXT NOT NULL,
    "Company_Name" TEXT,
    "RealEstate_License" TEXT,
    "Status" "Status_Seller" NOT NULL DEFAULT 'PENDING',
    "StartTime" TIMESTAMP(3),
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "nationalIdImage" TEXT,
    "publicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyPost" (
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
    "Nearby_Landmarks" "Nearby_Landmarks_list"[] DEFAULT ARRAY[]::"Nearby_Landmarks_list"[],
    "Additional_Amenities" "Additional_Amenities_list"[] DEFAULT ARRAY[]::"Additional_Amenities_list"[],
    "Parking_Space" INTEGER,
    "Sell_Rent" "Sell_Rent" NOT NULL,
    "Other_related_expenses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "Link_line" TEXT,
    "Link_facbook" TEXT,
    "Name" TEXT,
    "Phone" TEXT NOT NULL,
    "floor" INTEGER,
    "NumberOfUnits" INTEGER DEFAULT 1,
    "Status_post" "Status_post" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "sellerId" TEXT,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "Deposit_Percent" DOUBLE PRECISION,

    CONSTRAINT "PropertyPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyUnit" (
    "id" TEXT NOT NULL,
    "Unit_Number" TEXT NOT NULL,
    "Status" "UnitStatus" NOT NULL DEFAULT 'AVAILABLE',
    "propertyPostId" TEXT NOT NULL,

    CONSTRAINT "PropertyUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deposit" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT,
    "Deposit_Status" "Status_Disposit" NOT NULL,
    "Deposit_Amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyUnitId" TEXT NOT NULL,

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentUpload" (
    "id" TEXT NOT NULL,
    "DocumentName" TEXT NOT NULL,
    "DocumentUrl" TEXT NOT NULL,
    "CloudinaryPublicId" TEXT,
    "Review_Status" "Status_Review" NOT NULL,
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
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "PaymentType" "PaymentType" NOT NULL,
    "Payment_Amount" DOUBLE PRECISION NOT NULL,
    "Payment_Slip" TEXT NOT NULL,
    "Status" "Status_payment" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "unitId" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "referenceId" TEXT,
    "Title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'general',
    "targetUrl" TEXT,
    "readAt" TIMESTAMP(3),
    "Message" TEXT NOT NULL,
    "Status" "NotificationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "relatedProcess" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
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
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
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
CREATE TABLE "DateTimeSlot" (
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
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "dateTimeSlotId" TEXT NOT NULL,
    "isReminderSent" BOOLEAN NOT NULL DEFAULT false,
    "isDayOfAlertSent" BOOLEAN NOT NULL DEFAULT false,
    "isAtTimeAlertSent" BOOLEAN NOT NULL DEFAULT false,
    "finalSlipUrl" TEXT,
    "finalSlipUploadDate" TIMESTAMP(3),
    "bookingStatus" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "propertyUnitId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_userId_key" ON "Buyer"("userId");

-- CreateIndex
CREATE INDEX "Buyer_userId_idx" ON "Buyer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_userId_key" ON "Seller"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_National_ID_key" ON "Seller"("National_ID");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_RealEstate_License_key" ON "Seller"("RealEstate_License");

-- CreateIndex
CREATE INDEX "Seller_userId_idx" ON "Seller"("userId");

-- CreateIndex
CREATE INDEX "Seller_Status_idx" ON "Seller"("Status");

-- CreateIndex
CREATE INDEX "PropertyPost_sellerId_createdAt_idx" ON "PropertyPost"("sellerId", "createdAt");

-- CreateIndex
CREATE INDEX "PropertyPost_userId_createdAt_idx" ON "PropertyPost"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PropertyPost_Status_post_createdAt_idx" ON "PropertyPost"("Status_post", "createdAt");

-- CreateIndex
CREATE INDEX "PropertyPost_Province_District_Subdistrict_idx" ON "PropertyPost"("Province", "District", "Subdistrict");

-- CreateIndex
CREATE INDEX "PropertyUnit_propertyPostId_Status_idx" ON "PropertyUnit"("propertyPostId", "Status");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyUnit_propertyPostId_Unit_Number_key" ON "PropertyUnit"("propertyPostId", "Unit_Number");

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_propertyUnitId_key" ON "Deposit"("propertyUnitId");

-- CreateIndex
CREATE INDEX "Deposit_userId_createdAt_idx" ON "Deposit"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Deposit_postId_Deposit_Status_idx" ON "Deposit"("postId", "Deposit_Status");

-- CreateIndex
CREATE INDEX "DocumentUpload_postId_idx" ON "DocumentUpload"("postId");

-- CreateIndex
CREATE INDEX "DocumentUpload_userId_idx" ON "DocumentUpload"("userId");

-- CreateIndex
CREATE INDEX "DocumentUpload_unitId_idx" ON "DocumentUpload"("unitId");

-- CreateIndex
CREATE INDEX "Payment_userId_createdAt_idx" ON "Payment"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Payment_postId_Status_idx" ON "Payment"("postId", "Status");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_Status_idx" ON "Notification"("userId", "Status");

-- CreateIndex
CREATE INDEX "Image_propertyPostId_idx" ON "Image"("propertyPostId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_expiresAt_idx" ON "PasswordResetToken"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "Video_postId_idx" ON "Video"("postId");

-- CreateIndex
CREATE INDEX "DateTimeSlot_sellerId_startTime_idx" ON "DateTimeSlot"("sellerId", "startTime");

-- CreateIndex
CREATE INDEX "DateTimeSlot_postId_startTime_idx" ON "DateTimeSlot"("postId", "startTime");

-- CreateIndex
CREATE INDEX "DateTimeSlot_isBooked_idx" ON "DateTimeSlot"("isBooked");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_dateTimeSlotId_key" ON "Booking"("dateTimeSlotId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_propertyUnitId_key" ON "Booking"("propertyUnitId");

-- CreateIndex
CREATE INDEX "Booking_buyerId_createdAt_idx" ON "Booking"("buyerId", "createdAt");

-- CreateIndex
CREATE INDEX "Booking_sellerId_createdAt_idx" ON "Booking"("sellerId", "createdAt");

-- CreateIndex
CREATE INDEX "Booking_bookingStatus_createdAt_idx" ON "Booking"("bookingStatus", "createdAt");

-- AddForeignKey
ALTER TABLE "Buyer" ADD CONSTRAINT "Buyer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyPost" ADD CONSTRAINT "PropertyPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyPost" ADD CONSTRAINT "PropertyPost_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyPost" ADD CONSTRAINT "PropertyPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyUnit" ADD CONSTRAINT "PropertyUnit_propertyPostId_fkey" FOREIGN KEY ("propertyPostId") REFERENCES "PropertyPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_postId_fkey" FOREIGN KEY ("postId") REFERENCES "PropertyPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_propertyUnitId_fkey" FOREIGN KEY ("propertyUnitId") REFERENCES "PropertyUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentUpload" ADD CONSTRAINT "DocumentUpload_depositId_fkey" FOREIGN KEY ("depositId") REFERENCES "Deposit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentUpload" ADD CONSTRAINT "DocumentUpload_postId_fkey" FOREIGN KEY ("postId") REFERENCES "PropertyPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentUpload" ADD CONSTRAINT "DocumentUpload_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "PropertyUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentUpload" ADD CONSTRAINT "DocumentUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "PropertyPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "PropertyUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_propertyPostId_fkey" FOREIGN KEY ("propertyPostId") REFERENCES "PropertyPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_postId_fkey" FOREIGN KEY ("postId") REFERENCES "PropertyPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateTimeSlot" ADD CONSTRAINT "DateTimeSlot_postId_fkey" FOREIGN KEY ("postId") REFERENCES "PropertyPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateTimeSlot" ADD CONSTRAINT "DateTimeSlot_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_dateTimeSlotId_fkey" FOREIGN KEY ("dateTimeSlotId") REFERENCES "DateTimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_propertyUnitId_fkey" FOREIGN KEY ("propertyUnitId") REFERENCES "PropertyUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
