/*
  Warnings:

  - You are about to drop the column `bookAuthor` on the `BookLog` table. All the data in the column will be lost.
  - You are about to drop the column `bookThumbnail` on the `BookLog` table. All the data in the column will be lost.
  - You are about to drop the column `bookTitle` on the `BookLog` table. All the data in the column will be lost.
  - Added the required column `author` to the `BookLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `BookLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `readDate` on table `BookLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BookLog" DROP COLUMN "bookAuthor",
DROP COLUMN "bookThumbnail",
DROP COLUMN "bookTitle",
ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "readDate" SET NOT NULL;
