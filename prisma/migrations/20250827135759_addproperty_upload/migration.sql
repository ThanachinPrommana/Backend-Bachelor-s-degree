-- AlterTable
ALTER TABLE "PropertyPost" ADD COLUMN     "floor" INTEGER;

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

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_postId_fkey" FOREIGN KEY ("postId") REFERENCES "PropertyPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
