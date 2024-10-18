-- CreateTable
CREATE TABLE "GuideDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "adharNo" TEXT NOT NULL,
    "pincode" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "languages" TEXT[],
    "experience" INTEGER NOT NULL,

    CONSTRAINT "GuideDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuideCertificates" (
    "id" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "GuideCertificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuideDetails_userId_key" ON "GuideDetails"("userId");

-- AddForeignKey
ALTER TABLE "GuideDetails" ADD CONSTRAINT "GuideDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideCertificates" ADD CONSTRAINT "GuideCertificates_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "GuideDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
