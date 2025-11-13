-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('READING', 'DONE', 'WANT_TO_READ');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'FOLLOWERS', 'PRIVATE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookTitle" TEXT NOT NULL,
    "bookAuthor" TEXT NOT NULL,
    "bookThumbnail" TEXT,
    "rating" INTEGER,
    "status" "ReadingStatus" NOT NULL DEFAULT 'DONE',
    "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
    "content" TEXT NOT NULL,
    "readDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookLogId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookLogTag" (
    "bookLogId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "BookLogTag_pkey" PRIMARY KEY ("bookLogId","tagId")
);

-- CreateTable
CREATE TABLE "Like" (
    "userId" INTEGER NOT NULL,
    "bookLogId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("userId","bookLogId")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "userId" INTEGER NOT NULL,
    "bookLogId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("userId","bookLogId")
);

-- CreateTable
CREATE TABLE "Follow" (
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("followerId","followingId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "BookLog" ADD CONSTRAINT "BookLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_bookLogId_fkey" FOREIGN KEY ("bookLogId") REFERENCES "BookLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookLogTag" ADD CONSTRAINT "BookLogTag_bookLogId_fkey" FOREIGN KEY ("bookLogId") REFERENCES "BookLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookLogTag" ADD CONSTRAINT "BookLogTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_bookLogId_fkey" FOREIGN KEY ("bookLogId") REFERENCES "BookLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_bookLogId_fkey" FOREIGN KEY ("bookLogId") REFERENCES "BookLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
