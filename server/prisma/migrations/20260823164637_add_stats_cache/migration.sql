-- CreateTable
CREATE TABLE "StatsCache" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalPlaysThisMonth" INTEGER NOT NULL,
    "hoursListened" JSONB NOT NULL,
    "listeningTrend" JSONB NOT NULL,
    "avgReleaseYear" INTEGER NOT NULL,
    "longestStreak" INTEGER NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StatsCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StatsCache_userId_key" ON "StatsCache"("userId");

-- AddForeignKey
ALTER TABLE "StatsCache" ADD CONSTRAINT "StatsCache_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
