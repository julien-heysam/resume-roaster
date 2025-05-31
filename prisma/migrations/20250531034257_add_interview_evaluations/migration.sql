-- CreateTable
CREATE TABLE "interview_evaluations" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "user_id" TEXT,
    "evaluation_type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "questions_count" INTEGER NOT NULL,
    "overall_score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "interview_evaluations_analysis_id_idx" ON "interview_evaluations"("analysis_id");

-- CreateIndex
CREATE INDEX "interview_evaluations_user_id_idx" ON "interview_evaluations"("user_id");

-- CreateIndex
CREATE INDEX "interview_evaluations_evaluation_type_idx" ON "interview_evaluations"("evaluation_type");

-- CreateIndex
CREATE INDEX "interview_evaluations_created_at_idx" ON "interview_evaluations"("created_at");

-- AddForeignKey
ALTER TABLE "interview_evaluations" ADD CONSTRAINT "interview_evaluations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_evaluations" ADD CONSTRAINT "interview_evaluations_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "shared_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
