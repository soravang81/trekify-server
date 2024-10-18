/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `TravelBuddy` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "TravelBuddyRequest" DROP CONSTRAINT "TravelBuddyRequest_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "TravelBuddyRequest" DROP CONSTRAINT "TravelBuddyRequest_senderId_fkey";

-- AlterTable
ALTER TABLE "TravelBuddy" ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "gender" SET DATA TYPE TEXT,
ALTER COLUMN "travelStyle" SET NOT NULL,
ALTER COLUMN "travelStyle" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "TravelBuddy_userId_key" ON "TravelBuddy"("userId");

-- CreateIndex
CREATE INDEX "TravelBuddy_userId_idx" ON "TravelBuddy"("userId");

-- CreateIndex
CREATE INDEX "TravelBuddyRequest_senderId_idx" ON "TravelBuddyRequest"("senderId");

-- CreateIndex
CREATE INDEX "TravelBuddyRequest_receiverId_idx" ON "TravelBuddyRequest"("receiverId");

-- RenameForeignKey
ALTER TABLE "TravelBuddyRequest" RENAME CONSTRAINT "TravelBuddyRequest_travelBuddy_fkey" TO "TravelBuddyRequest_senderId_fkey";

-- AddForeignKey
ALTER TABLE "TravelBuddyRequest" ADD CONSTRAINT "TravelBuddyRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "TravelBuddy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
