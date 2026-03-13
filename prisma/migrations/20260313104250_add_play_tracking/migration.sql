-- CreateTable
CREATE TABLE "Play" (
    "id" TEXT NOT NULL,
    "profileId" TEXT,
    "beatId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Play_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Play_beatId_idx" ON "Play"("beatId");

-- CreateIndex
CREATE INDEX "Play_profileId_idx" ON "Play"("profileId");

-- CreateIndex
CREATE INDEX "Play_createdAt_idx" ON "Play"("createdAt");

-- AddForeignKey
ALTER TABLE "Play" ADD CONSTRAINT "Play_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Play" ADD CONSTRAINT "Play_beatId_fkey" FOREIGN KEY ("beatId") REFERENCES "Beat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
