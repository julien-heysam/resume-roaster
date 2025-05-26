-- CreateTable
CREATE TABLE "shared_analyses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "analysisData" TEXT NOT NULL,
    "settings" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shared_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shared_analyses_userId_idx" ON "shared_analyses"("userId");

-- CreateIndex
CREATE INDEX "shared_analyses_expiresAt_idx" ON "shared_analyses"("expiresAt");

-- AddForeignKey
ALTER TABLE "shared_analyses" ADD CONSTRAINT "shared_analyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
