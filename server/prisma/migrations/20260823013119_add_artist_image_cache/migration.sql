-- CreateTable
CREATE TABLE "ArtistImageCache" (
    "id" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "imageUrl" TEXT,
    "lastFetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArtistImageCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArtistImageCache_artistName_key" ON "ArtistImageCache"("artistName");
