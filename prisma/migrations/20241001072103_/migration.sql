-- CreateTable
CREATE TABLE "BuddyRequest" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuddyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buddy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "buddyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Buddy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Buddy_userId_buddyId_key" ON "Buddy"("userId", "buddyId");

-- AddForeignKey
ALTER TABLE "BuddyRequest" ADD CONSTRAINT "BuddyRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuddyRequest" ADD CONSTRAINT "BuddyRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buddy" ADD CONSTRAINT "Buddy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buddy" ADD CONSTRAINT "Buddy_buddyId_fkey" FOREIGN KEY ("buddyId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
