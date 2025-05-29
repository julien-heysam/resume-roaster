-- AlterTable
ALTER TABLE "analyses" ADD COLUMN     "jobSummaryId" TEXT;

-- AlterTable
ALTER TABLE "resume_optimizations" ADD COLUMN     "jobSummaryId" TEXT;

-- CreateTable
CREATE TABLE "job_description_summaries" (
    "id" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "originalText" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "keyRequirements" TEXT[],
    "companyName" TEXT,
    "jobTitle" TEXT,
    "location" TEXT,
    "salaryRange" TEXT,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 1,
    "totalTokensUsed" INTEGER NOT NULL DEFAULT 0,
    "totalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "processingTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_description_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_description_summaries_contentHash_key" ON "job_description_summaries"("contentHash");

-- CreateIndex
CREATE INDEX "job_description_summaries_contentHash_idx" ON "job_description_summaries"("contentHash");

-- CreateIndex
CREATE INDEX "job_description_summaries_createdAt_idx" ON "job_description_summaries"("createdAt");

-- CreateIndex
CREATE INDEX "job_description_summaries_usageCount_idx" ON "job_description_summaries"("usageCount");

-- CreateIndex
CREATE INDEX "analyses_jobSummaryId_idx" ON "analyses"("jobSummaryId");

-- CreateIndex
CREATE INDEX "resume_optimizations_jobSummaryId_idx" ON "resume_optimizations"("jobSummaryId");

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_jobSummaryId_fkey" FOREIGN KEY ("jobSummaryId") REFERENCES "job_description_summaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_optimizations" ADD CONSTRAINT "resume_optimizations_jobSummaryId_fkey" FOREIGN KEY ("jobSummaryId") REFERENCES "job_description_summaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
