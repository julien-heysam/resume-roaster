-- AlterEnum
ALTER TYPE "ConversationType" ADD VALUE 'RESUME_EXTRACTION';

-- AlterEnum
ALTER TYPE "UsageAction" ADD VALUE 'RESUME_OPTIMIZATION';

-- CreateTable
CREATE TABLE "resume_optimizations" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "analysisId" TEXT,
    "documentId" TEXT,
    "jobDescription" TEXT NOT NULL,
    "resumeText" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "extractedData" TEXT NOT NULL,
    "optimizedResume" TEXT NOT NULL,
    "optimizationSuggestions" TEXT[],
    "atsScore" INTEGER,
    "keywordsMatched" TEXT[],
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "conversationId" TEXT,
    "totalTokensUsed" INTEGER NOT NULL DEFAULT 0,
    "totalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "processingTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resume_optimizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resume_optimizations_userId_idx" ON "resume_optimizations"("userId");

-- CreateIndex
CREATE INDEX "resume_optimizations_analysisId_idx" ON "resume_optimizations"("analysisId");

-- CreateIndex
CREATE INDEX "resume_optimizations_createdAt_idx" ON "resume_optimizations"("createdAt");

-- CreateIndex
CREATE INDEX "resume_optimizations_atsScore_idx" ON "resume_optimizations"("atsScore");

-- AddForeignKey
ALTER TABLE "resume_optimizations" ADD CONSTRAINT "resume_optimizations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_optimizations" ADD CONSTRAINT "resume_optimizations_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_optimizations" ADD CONSTRAINT "resume_optimizations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_optimizations" ADD CONSTRAINT "resume_optimizations_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "llm_conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
