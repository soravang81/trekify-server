-- CreateTable
CREATE TABLE "GuideBookings" (
    "id" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuideBookings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GuideBookings" ADD CONSTRAINT "GuideBookings_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "GuideDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideBookings" ADD CONSTRAINT "GuideBookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
