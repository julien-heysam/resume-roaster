-- CreateTable
CREATE TABLE "cover_letters" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "content" TEXT NOT NULL,
    "tone" TEXT NOT NULL DEFAULT 'professional',
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "analysisId" TEXT,
    "documentId" TEXT,
    "jobSummaryId" TEXT,
    "contentHash" TEXT NOT NULL,
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

    CONSTRAINT "cover_letters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "optimized_resumes" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "content" TEXT NOT NULL,
    "extractedData" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "atsScore" INTEGER,
    "keywordsMatched" TEXT[],
    "optimizationSuggestions" TEXT[],
    "analysisId" TEXT,
    "documentId" TEXT,
    "jobSummaryId" TEXT,
    "contentHash" TEXT NOT NULL,
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

    CONSTRAINT "optimized_resumes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cover_letters_contentHash_key" ON "cover_letters"("contentHash");

-- CreateIndex
CREATE INDEX "cover_letters_userId_idx" ON "cover_letters"("userId");

-- CreateIndex
CREATE INDEX "cover_letters_analysisId_idx" ON "cover_letters"("analysisId");

-- CreateIndex
CREATE INDEX "cover_letters_documentId_idx" ON "cover_letters"("documentId");

-- CreateIndex
CREATE INDEX "cover_letters_jobSummaryId_idx" ON "cover_letters"("jobSummaryId");

-- CreateIndex
CREATE INDEX "cover_letters_contentHash_idx" ON "cover_letters"("contentHash");

-- CreateIndex
CREATE INDEX "cover_letters_createdAt_idx" ON "cover_letters"("createdAt");

-- CreateIndex
CREATE INDEX "cover_letters_usageCount_idx" ON "cover_letters"("usageCount");

-- CreateIndex
CREATE UNIQUE INDEX "optimized_resumes_contentHash_key" ON "optimized_resumes"("contentHash");

-- CreateIndex
CREATE INDEX "optimized_resumes_userId_idx" ON "optimized_resumes"("userId");

-- CreateIndex
CREATE INDEX "optimized_resumes_analysisId_idx" ON "optimized_resumes"("analysisId");

-- CreateIndex
CREATE INDEX "optimized_resumes_documentId_idx" ON "optimized_resumes"("documentId");

-- CreateIndex
CREATE INDEX "optimized_resumes_jobSummaryId_idx" ON "optimized_resumes"("jobSummaryId");

-- CreateIndex
CREATE INDEX "optimized_resumes_contentHash_idx" ON "optimized_resumes"("contentHash");

-- CreateIndex
CREATE INDEX "optimized_resumes_createdAt_idx" ON "optimized_resumes"("createdAt");

-- CreateIndex
CREATE INDEX "optimized_resumes_usageCount_idx" ON "optimized_resumes"("usageCount");

-- CreateIndex
CREATE INDEX "optimized_resumes_atsScore_idx" ON "optimized_resumes"("atsScore");

-- AddForeignKey
ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_jobSummaryId_fkey" FOREIGN KEY ("jobSummaryId") REFERENCES "job_description_summaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "llm_conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "optimized_resumes" ADD CONSTRAINT "optimized_resumes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "optimized_resumes" ADD CONSTRAINT "optimized_resumes_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "optimized_resumes" ADD CONSTRAINT "optimized_resumes_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "optimized_resumes" ADD CONSTRAINT "optimized_resumes_jobSummaryId_fkey" FOREIGN KEY ("jobSummaryId") REFERENCES "job_description_summaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "optimized_resumes" ADD CONSTRAINT "optimized_resumes_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "llm_conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
