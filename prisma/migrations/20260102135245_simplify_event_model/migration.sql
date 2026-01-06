/*
  Warnings:

  - You are about to drop the column `descriptionHtml` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `edition` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `headline` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `subheadline` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Event` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Event_slug_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "descriptionHtml",
DROP COLUMN "edition",
DROP COLUMN "headline",
DROP COLUMN "imageUrl",
DROP COLUMN "slug",
DROP COLUMN "subheadline",
DROP COLUMN "videoUrl";
