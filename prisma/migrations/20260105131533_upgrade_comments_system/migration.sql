/*
  Warnings:

  - You are about to drop the `CommentLike` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommentLike" DROP CONSTRAINT "CommentLike_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentLike" DROP CONSTRAINT "CommentLike_userId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "parentId" TEXT;

-- DropTable
DROP TABLE "CommentLike";

-- CreateTable
CREATE TABLE "CommentReaction" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CommentReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentReaction_commentId_userId_type_key" ON "CommentReaction"("commentId", "userId", "type");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CommentReaction" ADD CONSTRAINT "CommentReaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReaction" ADD CONSTRAINT "CommentReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
