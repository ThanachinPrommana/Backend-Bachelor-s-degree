-- AlterTable
ALTER TABLE "public"."Buyer" ADD COLUMN     "Preferred_Subdistrict" TEXT,
ALTER COLUMN "Monthly_Income" DROP NOT NULL,
ALTER COLUMN "Family_Size" DROP NOT NULL,
ALTER COLUMN "Preferred_Province" DROP NOT NULL,
ALTER COLUMN "Preferred_District" DROP NOT NULL;
