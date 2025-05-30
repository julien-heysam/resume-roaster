/*
  Warnings:

  - The values [USER,ASSISTANT,SYSTEM] on the enum `MessageRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `analysisId` on the `extracted_resumes` table. All the data in the column will be lost.
  - You are about to drop the column `contentHash` on the `extracted_resumes` table. All the data in the column will be lost.
  - You are about to drop the column `conversationId` on the `extracted_resumes` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `extracted_resumes` table. All the data in the column will be lost.
  - You are about to drop the column `documentId` on the `extracted_resumes` table. All the data in the column will be lost.
  - You are about to drop the column `extractedData` on the `extracted_resumes` table. All the data in the column will be lost.
  - You are about to drop the column `lastUsedAt` on the `extracted_resumes` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `extracted_resumes` table. All the data in the column will be lost.
  - You are about to drop the column `processingTime` on the `extracted_resumes` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `extracted_resumes` table. All the data in the column will be lost.
  - You are about to drop the column `resumeText` on the `extracted_resumes` table. All the data in the column will be lost.
  - You are about to drop the column `totalCost` on the `extracted_resumes` table. All the data in the column will be lost.
  - You are about to drop the column `totalTokensUsed` on the `extracted_resumes` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `extracted_resumes` table. All the data in the column will be lost.
  - You are about to drop the column `usageCount` on the `extracted_resumes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `extracted_resumes` table. All the data in the column will be lost.
  - You are about to drop the column `billingPeriodEnd` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `billingPeriodStart` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `generatedAt` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `itemCount` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `stripeInvoiceId` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `stripePaymentId` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `invoices` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to drop the column `conversationId` on the `llm_messages` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `llm_messages` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `llm_messages` table. All the data in the column will be lost.
  - You are about to drop the column `finishReason` on the `llm_messages` table. All the data in the column will be lost.
  - You are about to drop the column `inputTokens` on the `llm_messages` table. All the data in the column will be lost.
  - You are about to drop the column `maxTokens` on the `llm_messages` table. All the data in the column will be lost.
  - You are about to drop the column `messageIndex` on the `llm_messages` table. All the data in the column will be lost.
  - You are about to drop the column `outputTokens` on the `llm_messages` table. All the data in the column will be lost.
  - You are about to drop the column `processingTime` on the `llm_messages` table. All the data in the column will be lost.
  - You are about to drop the column `totalTokens` on the `llm_messages` table. All the data in the column will be lost.
  - You are about to alter the column `temperature` on the `llm_messages` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(3,2)`.
  - You are about to drop the column `createdAt` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `analysisData` on the `shared_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `shared_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `shared_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `shared_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `shared_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `shared_analyses` table. All the data in the column will be lost.
  - The `settings` column on the `shared_analyses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `hashedPassword` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastRoastReset` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyRoasts` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionEndsAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionTier` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `totalRoasts` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `analyses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cover_letters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job_description_summaries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `llm_conversations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `optimized_resumes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resume_optimizations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usage_records` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[content_hash]` on the table `extracted_resumes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_invoice_id]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[llm_call_id,message_index]` on the table `llm_messages` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[session_token]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content_hash` to the `extracted_resumes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data` to the `extracted_resumes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resume_id` to the `extracted_resumes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billing_period_end` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billing_period_start` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_count` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `llm_call_id` to the `llm_messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message_index` to the `llm_messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_token` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `shared_analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roast_id` to the `shared_analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `shared_analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LlmCallStatus" AS ENUM ('COMPLETED', 'FAILED', 'TIMEOUT');

-- AlterEnum
BEGIN;
CREATE TYPE "MessageRole_new" AS ENUM ('system', 'user', 'assistant');
ALTER TABLE "llm_messages" ALTER COLUMN "role" TYPE "MessageRole_new" USING ("role"::text::"MessageRole_new");
ALTER TYPE "MessageRole" RENAME TO "MessageRole_old";
ALTER TYPE "MessageRole_new" RENAME TO "MessageRole";
DROP TYPE "MessageRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "analyses" DROP CONSTRAINT "analyses_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "analyses" DROP CONSTRAINT "analyses_documentId_fkey";

-- DropForeignKey
ALTER TABLE "analyses" DROP CONSTRAINT "analyses_jobSummaryId_fkey";

-- DropForeignKey
ALTER TABLE "analyses" DROP CONSTRAINT "analyses_userId_fkey";

-- DropForeignKey
ALTER TABLE "cover_letters" DROP CONSTRAINT "cover_letters_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "cover_letters" DROP CONSTRAINT "cover_letters_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "cover_letters" DROP CONSTRAINT "cover_letters_documentId_fkey";

-- DropForeignKey
ALTER TABLE "cover_letters" DROP CONSTRAINT "cover_letters_jobSummaryId_fkey";

-- DropForeignKey
ALTER TABLE "cover_letters" DROP CONSTRAINT "cover_letters_userId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_userId_fkey";

-- DropForeignKey
ALTER TABLE "extracted_resumes" DROP CONSTRAINT "extracted_resumes_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "extracted_resumes" DROP CONSTRAINT "extracted_resumes_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "extracted_resumes" DROP CONSTRAINT "extracted_resumes_documentId_fkey";

-- DropForeignKey
ALTER TABLE "extracted_resumes" DROP CONSTRAINT "extracted_resumes_userId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_userId_fkey";

-- DropForeignKey
ALTER TABLE "llm_conversations" DROP CONSTRAINT "llm_conversations_documentId_fkey";

-- DropForeignKey
ALTER TABLE "llm_conversations" DROP CONSTRAINT "llm_conversations_userId_fkey";

-- DropForeignKey
ALTER TABLE "llm_messages" DROP CONSTRAINT "llm_messages_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "optimized_resumes" DROP CONSTRAINT "optimized_resumes_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "optimized_resumes" DROP CONSTRAINT "optimized_resumes_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "optimized_resumes" DROP CONSTRAINT "optimized_resumes_documentId_fkey";

-- DropForeignKey
ALTER TABLE "optimized_resumes" DROP CONSTRAINT "optimized_resumes_extractedResumeId_fkey";

-- DropForeignKey
ALTER TABLE "optimized_resumes" DROP CONSTRAINT "optimized_resumes_jobSummaryId_fkey";

-- DropForeignKey
ALTER TABLE "optimized_resumes" DROP CONSTRAINT "optimized_resumes_userId_fkey";

-- DropForeignKey
ALTER TABLE "resume_optimizations" DROP CONSTRAINT "resume_optimizations_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "resume_optimizations" DROP CONSTRAINT "resume_optimizations_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "resume_optimizations" DROP CONSTRAINT "resume_optimizations_documentId_fkey";

-- DropForeignKey
ALTER TABLE "resume_optimizations" DROP CONSTRAINT "resume_optimizations_jobSummaryId_fkey";

-- DropForeignKey
ALTER TABLE "resume_optimizations" DROP CONSTRAINT "resume_optimizations_userId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "shared_analyses" DROP CONSTRAINT "shared_analyses_userId_fkey";

-- DropForeignKey
ALTER TABLE "usage_records" DROP CONSTRAINT "usage_records_documentId_fkey";

-- DropForeignKey
ALTER TABLE "usage_records" DROP CONSTRAINT "usage_records_userId_fkey";

-- DropIndex
DROP INDEX "extracted_resumes_analysisId_idx";

-- DropIndex
DROP INDEX "extracted_resumes_contentHash_idx";

-- DropIndex
DROP INDEX "extracted_resumes_contentHash_key";

-- DropIndex
DROP INDEX "extracted_resumes_createdAt_idx";

-- DropIndex
DROP INDEX "extracted_resumes_documentId_idx";

-- DropIndex
DROP INDEX "extracted_resumes_usageCount_idx";

-- DropIndex
DROP INDEX "extracted_resumes_userId_idx";

-- DropIndex
DROP INDEX "invoices_stripeInvoiceId_key";

-- DropIndex
DROP INDEX "invoices_userId_idx";

-- DropIndex
DROP INDEX "llm_messages_conversationId_idx";

-- DropIndex
DROP INDEX "llm_messages_conversationId_messageIndex_key";

-- DropIndex
DROP INDEX "llm_messages_createdAt_idx";

-- DropIndex
DROP INDEX "sessions_sessionToken_key";

-- DropIndex
DROP INDEX "shared_analyses_expiresAt_idx";

-- DropIndex
DROP INDEX "shared_analyses_userId_idx";

-- AlterTable
ALTER TABLE "extracted_resumes" DROP COLUMN "analysisId",
DROP COLUMN "contentHash",
DROP COLUMN "conversationId",
DROP COLUMN "createdAt",
DROP COLUMN "documentId",
DROP COLUMN "extractedData",
DROP COLUMN "lastUsedAt",
DROP COLUMN "model",
DROP COLUMN "processingTime",
DROP COLUMN "provider",
DROP COLUMN "resumeText",
DROP COLUMN "totalCost",
DROP COLUMN "totalTokensUsed",
DROP COLUMN "updatedAt",
DROP COLUMN "usageCount",
DROP COLUMN "userId",
ADD COLUMN     "content_hash" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data" JSONB NOT NULL,
ADD COLUMN     "resume_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "billingPeriodEnd",
DROP COLUMN "billingPeriodStart",
DROP COLUMN "generatedAt",
DROP COLUMN "itemCount",
DROP COLUMN "paidAt",
DROP COLUMN "stripeInvoiceId",
DROP COLUMN "stripePaymentId",
DROP COLUMN "userId",
ADD COLUMN     "billing_period_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "billing_period_start" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "item_count" INTEGER NOT NULL,
ADD COLUMN     "paid_at" TIMESTAMP(3),
ADD COLUMN     "stripe_invoice_id" TEXT,
ADD COLUMN     "stripe_payment_id" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "llm_messages" DROP COLUMN "conversationId",
DROP COLUMN "cost",
DROP COLUMN "createdAt",
DROP COLUMN "finishReason",
DROP COLUMN "inputTokens",
DROP COLUMN "maxTokens",
DROP COLUMN "messageIndex",
DROP COLUMN "outputTokens",
DROP COLUMN "processingTime",
DROP COLUMN "totalTokens",
ADD COLUMN     "cost_usd" DECIMAL(10,6) NOT NULL DEFAULT 0,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "finish_reason" TEXT,
ADD COLUMN     "input_tokens" INTEGER,
ADD COLUMN     "llm_call_id" TEXT NOT NULL,
ADD COLUMN     "max_tokens" INTEGER,
ADD COLUMN     "message_index" INTEGER NOT NULL,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "output_tokens" INTEGER,
ADD COLUMN     "processing_time_ms" INTEGER,
ADD COLUMN     "total_tokens" INTEGER,
ALTER COLUMN "temperature" SET DATA TYPE DECIMAL(3,2);

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "createdAt",
DROP COLUMN "sessionToken",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "session_token" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shared_analyses" DROP COLUMN "analysisData",
DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
DROP COLUMN "viewCount",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "roast_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "settings",
ADD COLUMN     "settings" JSONB;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "customerId",
DROP COLUMN "emailVerified",
DROP COLUMN "hashedPassword",
DROP COLUMN "lastRoastReset",
DROP COLUMN "monthlyRoasts",
DROP COLUMN "subscriptionEndsAt",
DROP COLUMN "subscriptionId",
DROP COLUMN "subscriptionTier",
DROP COLUMN "totalRoasts",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customer_id" TEXT,
ADD COLUMN     "email_verified" TIMESTAMP(3),
ADD COLUMN     "hashed_password" TEXT,
ADD COLUMN     "last_roast_reset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "monthly_roasts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subscription_ends_at" TIMESTAMP(3),
ADD COLUMN     "subscription_id" TEXT,
ADD COLUMN     "subscription_tier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "total_roasts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "accounts";

-- DropTable
DROP TABLE "analyses";

-- DropTable
DROP TABLE "cover_letters";

-- DropTable
DROP TABLE "documents";

-- DropTable
DROP TABLE "job_description_summaries";

-- DropTable
DROP TABLE "llm_conversations";

-- DropTable
DROP TABLE "optimized_resumes";

-- DropTable
DROP TABLE "resume_optimizations";

-- DropTable
DROP TABLE "usage_records";

-- DropEnum
DROP TYPE "ConversationStatus";

-- DropEnum
DROP TYPE "ConversationType";

-- DropEnum
DROP TYPE "UsageAction";

-- CreateTable
CREATE TABLE "llm_calls" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "operation_type" TEXT NOT NULL,
    "total_input_tokens" INTEGER NOT NULL DEFAULT 0,
    "total_output_tokens" INTEGER NOT NULL DEFAULT 0,
    "total_tokens" INTEGER NOT NULL DEFAULT 0,
    "total_cost_usd" DECIMAL(10,6) NOT NULL DEFAULT 0,
    "total_processing_time_ms" INTEGER,
    "status" "LlmCallStatus" NOT NULL DEFAULT 'COMPLETED',
    "error_message" TEXT,
    "resume_id" TEXT,
    "extracted_resume_id" TEXT,
    "extracted_job_id" TEXT,
    "generated_roast_id" TEXT,
    "generated_cover_letter_id" TEXT,
    "generated_resume_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "llm_calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "filename" TEXT NOT NULL,
    "file_hash" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "images" TEXT[],
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extracted_job_descriptions" (
    "id" TEXT NOT NULL,
    "content_hash" TEXT NOT NULL,
    "original_text" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "extracted_job_descriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "summarized_resumes" (
    "id" TEXT NOT NULL,
    "extracted_resume_id" TEXT NOT NULL,
    "content_hash" TEXT NOT NULL,
    "summary" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "summarized_resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "summarized_job_descriptions" (
    "id" TEXT NOT NULL,
    "extracted_job_id" TEXT NOT NULL,
    "content_hash" TEXT NOT NULL,
    "summary" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "summarized_job_descriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_roasts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "resume_id" TEXT,
    "extracted_resume_id" TEXT,
    "extracted_job_id" TEXT,
    "content_hash" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "overall_score" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generated_roasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_cover_letters" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "resume_id" TEXT,
    "extracted_resume_id" TEXT,
    "extracted_job_id" TEXT,
    "content_hash" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tone" TEXT NOT NULL DEFAULT 'professional',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generated_cover_letters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_resumes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "resume_id" TEXT,
    "extracted_resume_id" TEXT,
    "extracted_job_id" TEXT,
    "template_id" TEXT NOT NULL,
    "content_hash" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "ats_score" INTEGER,
    "keywords_matched" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generated_resumes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "llm_calls_user_id_idx" ON "llm_calls"("user_id");

-- CreateIndex
CREATE INDEX "llm_calls_provider_model_idx" ON "llm_calls"("provider", "model");

-- CreateIndex
CREATE INDEX "llm_calls_operation_type_idx" ON "llm_calls"("operation_type");

-- CreateIndex
CREATE INDEX "llm_calls_created_at_idx" ON "llm_calls"("created_at");

-- CreateIndex
CREATE INDEX "llm_calls_total_cost_usd_idx" ON "llm_calls"("total_cost_usd");

-- CreateIndex
CREATE INDEX "llm_calls_status_idx" ON "llm_calls"("status");

-- CreateIndex
CREATE UNIQUE INDEX "resumes_file_hash_key" ON "resumes"("file_hash");

-- CreateIndex
CREATE INDEX "resumes_user_id_idx" ON "resumes"("user_id");

-- CreateIndex
CREATE INDEX "resumes_file_hash_idx" ON "resumes"("file_hash");

-- CreateIndex
CREATE UNIQUE INDEX "extracted_job_descriptions_content_hash_key" ON "extracted_job_descriptions"("content_hash");

-- CreateIndex
CREATE INDEX "extracted_job_descriptions_content_hash_idx" ON "extracted_job_descriptions"("content_hash");

-- CreateIndex
CREATE UNIQUE INDEX "summarized_resumes_content_hash_key" ON "summarized_resumes"("content_hash");

-- CreateIndex
CREATE INDEX "summarized_resumes_content_hash_idx" ON "summarized_resumes"("content_hash");

-- CreateIndex
CREATE UNIQUE INDEX "summarized_job_descriptions_content_hash_key" ON "summarized_job_descriptions"("content_hash");

-- CreateIndex
CREATE INDEX "summarized_job_descriptions_content_hash_idx" ON "summarized_job_descriptions"("content_hash");

-- CreateIndex
CREATE UNIQUE INDEX "generated_roasts_content_hash_key" ON "generated_roasts"("content_hash");

-- CreateIndex
CREATE INDEX "generated_roasts_user_id_idx" ON "generated_roasts"("user_id");

-- CreateIndex
CREATE INDEX "generated_roasts_content_hash_idx" ON "generated_roasts"("content_hash");

-- CreateIndex
CREATE INDEX "generated_roasts_overall_score_idx" ON "generated_roasts"("overall_score");

-- CreateIndex
CREATE UNIQUE INDEX "generated_cover_letters_content_hash_key" ON "generated_cover_letters"("content_hash");

-- CreateIndex
CREATE INDEX "generated_cover_letters_user_id_idx" ON "generated_cover_letters"("user_id");

-- CreateIndex
CREATE INDEX "generated_cover_letters_content_hash_idx" ON "generated_cover_letters"("content_hash");

-- CreateIndex
CREATE UNIQUE INDEX "generated_resumes_content_hash_key" ON "generated_resumes"("content_hash");

-- CreateIndex
CREATE INDEX "generated_resumes_user_id_idx" ON "generated_resumes"("user_id");

-- CreateIndex
CREATE INDEX "generated_resumes_content_hash_idx" ON "generated_resumes"("content_hash");

-- CreateIndex
CREATE INDEX "generated_resumes_ats_score_idx" ON "generated_resumes"("ats_score");

-- CreateIndex
CREATE UNIQUE INDEX "extracted_resumes_content_hash_key" ON "extracted_resumes"("content_hash");

-- CreateIndex
CREATE INDEX "extracted_resumes_content_hash_idx" ON "extracted_resumes"("content_hash");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_stripe_invoice_id_key" ON "invoices"("stripe_invoice_id");

-- CreateIndex
CREATE INDEX "invoices_user_id_idx" ON "invoices"("user_id");

-- CreateIndex
CREATE INDEX "llm_messages_llm_call_id_idx" ON "llm_messages"("llm_call_id");

-- CreateIndex
CREATE INDEX "llm_messages_role_idx" ON "llm_messages"("role");

-- CreateIndex
CREATE INDEX "llm_messages_created_at_idx" ON "llm_messages"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "llm_messages_llm_call_id_message_index_key" ON "llm_messages"("llm_call_id", "message_index");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE INDEX "shared_analyses_user_id_idx" ON "shared_analyses"("user_id");

-- CreateIndex
CREATE INDEX "shared_analyses_expires_at_idx" ON "shared_analyses"("expires_at");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "llm_calls" ADD CONSTRAINT "llm_calls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "llm_calls" ADD CONSTRAINT "llm_calls_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "llm_calls" ADD CONSTRAINT "llm_calls_extracted_resume_id_fkey" FOREIGN KEY ("extracted_resume_id") REFERENCES "extracted_resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "llm_calls" ADD CONSTRAINT "llm_calls_extracted_job_id_fkey" FOREIGN KEY ("extracted_job_id") REFERENCES "extracted_job_descriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "llm_calls" ADD CONSTRAINT "llm_calls_generated_roast_id_fkey" FOREIGN KEY ("generated_roast_id") REFERENCES "generated_roasts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "llm_calls" ADD CONSTRAINT "llm_calls_generated_cover_letter_id_fkey" FOREIGN KEY ("generated_cover_letter_id") REFERENCES "generated_cover_letters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "llm_calls" ADD CONSTRAINT "llm_calls_generated_resume_id_fkey" FOREIGN KEY ("generated_resume_id") REFERENCES "generated_resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "llm_messages" ADD CONSTRAINT "llm_messages_llm_call_id_fkey" FOREIGN KEY ("llm_call_id") REFERENCES "llm_calls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extracted_resumes" ADD CONSTRAINT "extracted_resumes_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summarized_resumes" ADD CONSTRAINT "summarized_resumes_extracted_resume_id_fkey" FOREIGN KEY ("extracted_resume_id") REFERENCES "extracted_resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summarized_job_descriptions" ADD CONSTRAINT "summarized_job_descriptions_extracted_job_id_fkey" FOREIGN KEY ("extracted_job_id") REFERENCES "extracted_job_descriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_roasts" ADD CONSTRAINT "generated_roasts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_roasts" ADD CONSTRAINT "generated_roasts_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_roasts" ADD CONSTRAINT "generated_roasts_extracted_resume_id_fkey" FOREIGN KEY ("extracted_resume_id") REFERENCES "extracted_resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_roasts" ADD CONSTRAINT "generated_roasts_extracted_job_id_fkey" FOREIGN KEY ("extracted_job_id") REFERENCES "extracted_job_descriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_cover_letters" ADD CONSTRAINT "generated_cover_letters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_cover_letters" ADD CONSTRAINT "generated_cover_letters_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_cover_letters" ADD CONSTRAINT "generated_cover_letters_extracted_resume_id_fkey" FOREIGN KEY ("extracted_resume_id") REFERENCES "extracted_resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_cover_letters" ADD CONSTRAINT "generated_cover_letters_extracted_job_id_fkey" FOREIGN KEY ("extracted_job_id") REFERENCES "extracted_job_descriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_resumes" ADD CONSTRAINT "generated_resumes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_resumes" ADD CONSTRAINT "generated_resumes_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_resumes" ADD CONSTRAINT "generated_resumes_extracted_resume_id_fkey" FOREIGN KEY ("extracted_resume_id") REFERENCES "extracted_resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_resumes" ADD CONSTRAINT "generated_resumes_extracted_job_id_fkey" FOREIGN KEY ("extracted_job_id") REFERENCES "extracted_job_descriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_analyses" ADD CONSTRAINT "shared_analyses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_analyses" ADD CONSTRAINT "shared_analyses_roast_id_fkey" FOREIGN KEY ("roast_id") REFERENCES "generated_roasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
