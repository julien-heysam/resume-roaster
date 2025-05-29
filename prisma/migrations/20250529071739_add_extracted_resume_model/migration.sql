-- AlterEnum
ALTER TYPE "UsageAction" ADD VALUE 'RESUME_EXTRACTION';

-- AlterTable
ALTER TABLE "optimized_resumes" ADD COLUMN     "extractedResumeId" TEXT;

-- CreateTable
CREATE TABLE "extracted_resumes" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "documentId" TEXT,
    "analysisId" TEXT,
    "contentHash" TEXT NOT NULL,
    "resumeText" TEXT NOT NULL,
    "extractedData" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "conversationId" TEXT,
    "totalTokensUsed" INTEGER NOT NULL DEFAULT 0,
    "totalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "processingTime" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 1,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extracted_resumes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "extracted_resumes_contentHash_key" ON "extracted_resumes"("contentHash");

-- CreateIndex
CREATE INDEX "extracted_resumes_userId_idx" ON "extracted_resumes"("userId");

-- CreateIndex
CREATE INDEX "extracted_resumes_documentId_idx" ON "extracted_resumes"("documentId");

-- CreateIndex
CREATE INDEX "extracted_resumes_analysisId_idx" ON "extracted_resumes"("analysisId");

-- CreateIndex
CREATE INDEX "extracted_resumes_contentHash_idx" ON "extracted_resumes"("contentHash");

-- CreateIndex
CREATE INDEX "extracted_resumes_createdAt_idx" ON "extracted_resumes"("createdAt");

-- CreateIndex
CREATE INDEX "extracted_resumes_usageCount_idx" ON "extracted_resumes"("usageCount");

-- CreateIndex
CREATE INDEX "optimized_resumes_extractedResumeId_idx" ON "optimized_resumes"("extractedResumeId");

-- AddForeignKey
ALTER TABLE "optimized_resumes" ADD CONSTRAINT "optimized_resumes_extractedResumeId_fkey" FOREIGN KEY ("extractedResumeId") REFERENCES "extracted_resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extracted_resumes" ADD CONSTRAINT "extracted_resumes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extracted_resumes" ADD CONSTRAINT "extracted_resumes_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extracted_resumes" ADD CONSTRAINT "extracted_resumes_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extracted_resumes" ADD CONSTRAINT "extracted_resumes_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "llm_conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
