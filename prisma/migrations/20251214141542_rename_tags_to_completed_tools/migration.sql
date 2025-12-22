-- AlterTable
ALTER TABLE "User" ADD COLUMN     "completedTools" TEXT[] DEFAULT ARRAY[]::TEXT[];
