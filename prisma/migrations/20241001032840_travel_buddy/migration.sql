-- CreateTable
CREATE TABLE "TravelBuddy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "gender" TEXT[],
    "budget" DOUBLE PRECISION NOT NULL,
    "travelStyle" TEXT[],
    "bio" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelBuddy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelBuddyRequest" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelBuddyRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TravelBuddy" ADD CONSTRAINT "TravelBuddy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelBuddyRequest" ADD CONSTRAINT "TravelBuddyRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelBuddyRequest" ADD CONSTRAINT "TravelBuddyRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
