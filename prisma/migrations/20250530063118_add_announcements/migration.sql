-- CreateEnum
CREATE TYPE "AnnouncementType" AS ENUM ('COMING_SOON', 'IN_PROGRESS', 'BETA', 'NEW', 'MAINTENANCE', 'UPDATE');

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "feature_name" TEXT,
    "estimated_date" TEXT,
    "type" "AnnouncementType" NOT NULL DEFAULT 'COMING_SOON',
    "cta_text" TEXT,
    "cta_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "target_tiers" "SubscriptionTier"[],
    "dismissed_by" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "announcements_is_active_idx" ON "announcements"("is_active");

-- CreateIndex
CREATE INDEX "announcements_start_date_end_date_idx" ON "announcements"("start_date", "end_date");
