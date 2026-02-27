-- CreateTable
CREATE TABLE "Beat" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "producerId" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "bpm" INTEGER NOT NULL,
    "key" TEXT,
    "duration" INTEGER NOT NULL,
    "tags" TEXT[],
    "priceBasic" DOUBLE PRECISION NOT NULL,
    "pricePremium" DOUBLE PRECISION NOT NULL,
    "priceExclusive" DOUBLE PRECISION NOT NULL,
    "isExclusiveSold" BOOLEAN NOT NULL DEFAULT false,
    "exclusiveBuyer" TEXT,
    "coverImage" TEXT NOT NULL,
    "audioFile" TEXT NOT NULL,
    "description" VARCHAR(1000),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Beat_genre_idx" ON "Beat"("genre");

-- CreateIndex
CREATE INDEX "Beat_bpm_idx" ON "Beat"("bpm");

-- CreateIndex
CREATE INDEX "Beat_key_idx" ON "Beat"("key");

-- CreateIndex
CREATE INDEX "Beat_isPublished_idx" ON "Beat"("isPublished");

-- CreateIndex
CREATE INDEX "Beat_isExclusiveSold_idx" ON "Beat"("isExclusiveSold");

-- CreateIndex
CREATE INDEX "Beat_createdAt_idx" ON "Beat"("createdAt");

-- AddForeignKey
ALTER TABLE "Beat" ADD CONSTRAINT "Beat_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
