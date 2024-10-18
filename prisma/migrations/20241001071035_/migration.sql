/*
  Warnings:

  - The `travelStyle` column on the `TravelBuddy` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TravelBuddy" DROP COLUMN "travelStyle",
ADD COLUMN     "travelStyle" TEXT[];
