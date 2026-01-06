-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "edition" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "venueName" TEXT,
    "venueAddress" TEXT,
    "slug" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "subheadline" TEXT,
    "descriptionHtml" TEXT NOT NULL,
    "videoUrl" TEXT,
    "imageUrl" TEXT NOT NULL,
    "registrationLink" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
