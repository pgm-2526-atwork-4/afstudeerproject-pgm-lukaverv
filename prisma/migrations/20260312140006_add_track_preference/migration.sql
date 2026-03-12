-- CreateTable
CREATE TABLE "TrackPreference" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "description" VARCHAR(1000),
    "priceBasic" DOUBLE PRECISION DEFAULT 29.99,
    "pricePremium" DOUBLE PRECISION DEFAULT 49.99,
    "priceExclusive" DOUBLE PRECISION DEFAULT 199.99,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackPreference_profileId_key" ON "TrackPreference"("profileId");

-- CreateIndex
CREATE INDEX "TrackPreference_profileId_idx" ON "TrackPreference"("profileId");

-- AddForeignKey
ALTER TABLE "TrackPreference" ADD CONSTRAINT "TrackPreference_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
