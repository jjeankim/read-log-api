/*
  Warnings:

  - You are about to drop the column `status` on the `BookLog` table. All the data in the column will be lost.
  - You are about to drop the column `visibility` on the `BookLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookLog" DROP COLUMN "status",
DROP COLUMN "visibility",
ADD COLUMN     "isDone" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;
