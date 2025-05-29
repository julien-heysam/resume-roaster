/*
  Warnings:

  - The values [PRO,ENTERPRISE] on the enum `SubscriptionTier` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionTier_new" AS ENUM ('FREE', 'PLUS', 'PREMIUM');
ALTER TABLE "users" ALTER COLUMN "subscriptionTier" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "subscriptionTier" TYPE "SubscriptionTier_new" USING ("subscriptionTier"::text::"SubscriptionTier_new");
ALTER TYPE "SubscriptionTier" RENAME TO "SubscriptionTier_old";
ALTER TYPE "SubscriptionTier_new" RENAME TO "SubscriptionTier";
DROP TYPE "SubscriptionTier_old";
ALTER TABLE "users" ALTER COLUMN "subscriptionTier" SET DEFAULT 'FREE';
COMMIT;
