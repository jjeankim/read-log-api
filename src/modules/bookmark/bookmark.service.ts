import { prisma } from "../../config/db";

export const toggleBookmark = async (userId: number, bookLogId: number) => {
  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_bookLogId: {
        userId,
        bookLogId,
      },
    },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: {
        userId_bookLogId: {
          userId,
          bookLogId,
        },
      },
    });
    return { bookmarked: false };
  }

  await prisma.bookmark.create({
    data: {
      userId,
      bookLogId,
    },
  });
  return { bookmarked: true };
};

// 내 북마크 리스트
export const getMyBookmarks = async (userId: number) => {
  return prisma.bookmark.findMany({
    where: {
      userId,
    },
    include: {
      bookLog: {
        include: {
          user: { select: { id: true, name: true } },
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};
