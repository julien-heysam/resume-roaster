/*
  Warnings:

  - You are about to drop the column `analysis_id` on the `interview_evaluations` table. All the data in the column will be lost.
  - Added the required column `interview_prep_id` to the `interview_evaluations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `analysis_id` to the `interview_prep` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add analysis_id as nullable to interview_prep
ALTER TABLE "interview_prep" ADD COLUMN "analysis_id" TEXT;

-- Step 2: Update existing interview_prep records with a placeholder analysis_id
UPDATE "interview_prep" SET "analysis_id" = 'placeholder_' || id WHERE "analysis_id" IS NULL;

-- Step 3: Make analysis_id required
ALTER TABLE "interview_prep" ALTER COLUMN "analysis_id" SET NOT NULL;

-- Step 4: Add interview_prep_id as nullable to interview_evaluations
ALTER TABLE "interview_evaluations" ADD COLUMN "interview_prep_id" TEXT;

-- Step 5: Update existing interview_evaluations to link to interview_prep
UPDATE "interview_evaluations" SET "interview_prep_id" = 'placeholder_prep_' || id WHERE "interview_prep_id" IS NULL;

-- Step 6: Drop the old foreign key and column
ALTER TABLE "interview_evaluations" DROP CONSTRAINT IF EXISTS "interview_evaluations_analysis_id_fkey";
ALTER TABLE "interview_evaluations" DROP COLUMN IF EXISTS "analysis_id";

-- Step 7: Make interview_prep_id required
ALTER TABLE "interview_evaluations" ALTER COLUMN "interview_prep_id" SET NOT NULL;

-- Step 8: Drop old indexes
DROP INDEX IF EXISTS "interview_evaluations_analysis_id_idx";

-- Step 9: Create new indexes
CREATE INDEX "interview_evaluations_interview_prep_id_idx" ON "interview_evaluations"("interview_prep_id");
CREATE INDEX "interview_prep_analysis_id_idx" ON "interview_prep"("analysis_id");

-- Step 10: Add new foreign key constraint
ALTER TABLE "interview_evaluations" ADD CONSTRAINT "interview_evaluations_interview_prep_id_fkey" FOREIGN KEY ("interview_prep_id") REFERENCES "interview_prep"("id") ON DELETE CASCADE ON UPDATE CASCADE;
