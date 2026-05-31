/*
  Warnings:

  - You are about to drop the column `lastStepId` on the `UserJourneyProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserJourneyProgress" DROP COLUMN "lastStepId";

-- CreateTable
CREATE TABLE "JourneyContentStep" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "videoUrls" TEXT[],
    "toolDescription" TEXT,
    "toolDownloadUrl" TEXT,
    "taskDescription" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,

    CONSTRAINT "JourneyContentStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JourneyContentStep_slug_key" ON "JourneyContentStep"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyContentStep_journeyId_order_key" ON "JourneyContentStep"("journeyId", "order");

-- AddForeignKey
ALTER TABLE "JourneyContentStep" ADD CONSTRAINT "JourneyContentStep_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
