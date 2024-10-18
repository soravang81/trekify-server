/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `PostLike` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PostLike_postId_key" ON "PostLike"("postId");
