/*
  Warnings:

  - The `gender` column on the `TravelBuddy` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `budget` on the `TravelBuddy` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- DropIndex
DROP INDEX "TravelBuddy_userId_idx";

-- DropIndex
DROP INDEX "TravelBuddy_userId_key";

-- AlterTable
ALTER TABLE "TravelBuddy" DROP COLUMN "gender",
ADD COLUMN     "gender" TEXT[],
ALTER COLUMN "budget" SET DATA TYPE INTEGER;
