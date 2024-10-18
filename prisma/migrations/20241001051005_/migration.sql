-- AddForeignKey
ALTER TABLE "TravelBuddyRequest" ADD CONSTRAINT "TravelBuddyRequest_travelBuddy_fkey" FOREIGN KEY ("senderId") REFERENCES "TravelBuddy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
