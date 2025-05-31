/*
  Warnings:

  - You are about to drop the column `url` on the `extracted_job_descriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "extracted_job_descriptions" DROP COLUMN "url";

-- AlterTable
ALTER TABLE "llm_calls" ADD COLUMN     "interview_prep_id" TEXT;

-- CreateTable
CREATE TABLE "interview_prep" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "resume_id" TEXT,
    "extracted_resume_id" TEXT,
    "extracted_job_id" TEXT,
    "content_hash" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "category" TEXT NOT NULL DEFAULT 'general',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_prep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "interview_prep_content_hash_key" ON "interview_prep"("content_hash");

-- CreateIndex
CREATE INDEX "interview_prep_user_id_idx" ON "interview_prep"("user_id");

-- CreateIndex
CREATE INDEX "interview_prep_content_hash_idx" ON "interview_prep"("content_hash");

-- CreateIndex
CREATE INDEX "interview_prep_difficulty_idx" ON "interview_prep"("difficulty");

-- CreateIndex
CREATE INDEX "interview_prep_category_idx" ON "interview_prep"("category");

-- AddForeignKey
ALTER TABLE "llm_calls" ADD CONSTRAINT "llm_calls_interview_prep_id_fkey" FOREIGN KEY ("interview_prep_id") REFERENCES "interview_prep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_prep" ADD CONSTRAINT "interview_prep_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_prep" ADD CONSTRAINT "interview_prep_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_prep" ADD CONSTRAINT "interview_prep_extracted_resume_id_fkey" FOREIGN KEY ("extracted_resume_id") REFERENCES "extracted_resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_prep" ADD CONSTRAINT "interview_prep_extracted_job_id_fkey" FOREIGN KEY ("extracted_job_id") REFERENCES "extracted_job_descriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
