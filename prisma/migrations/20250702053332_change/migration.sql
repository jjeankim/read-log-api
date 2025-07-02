/*
  Warnings:

  - The `bookImgUrl` column on the `Log` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "bookImgUrl",
ADD COLUMN     "bookImgUrl" TEXT[];
