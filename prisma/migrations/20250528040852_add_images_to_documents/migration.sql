-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
