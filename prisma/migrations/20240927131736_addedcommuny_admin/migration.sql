-- CreateTable
CREATE TABLE "CommunityAdmin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommunityAdmin_userId_key" ON "CommunityAdmin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityAdmin_communityId_key" ON "CommunityAdmin"("communityId");

-- AddForeignKey
ALTER TABLE "CommunityAdmin" ADD CONSTRAINT "CommunityAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityAdmin" ADD CONSTRAINT "CommunityAdmin_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
