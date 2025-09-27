/*
  Warnings:

  - You are about to drop the column `Unit_Name` on the `PropertyUnit` table. All the data in the column will be lost.
  - Added the required column `Unit_Number` to the `PropertyUnit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."PropertyPost" ADD COLUMN     "NumberOfUnits" INTEGER DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."PropertyUnit" DROP COLUMN "Unit_Name",
ADD COLUMN     "Unit_Number" TEXT NOT NULL;
