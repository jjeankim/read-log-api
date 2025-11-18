import { prisma } from "../../config/db";

export const toggleLike = async (userId: number, bookLogId: number) => {
  const existing = await prisma.like.findUnique({
    where: {
      userId_bookLogId: {
        userId,
        bookLogId,
      },
    },
  });

  if (existing) {
    await prisma.like.delete({
      where: {
        userId_bookLogId: {
          userId,
          bookLogId,
        },
      },
    });

    const count = await prisma.like.count({
      where: { bookLogId },
    });

    return { liked: false, likeCount: count };
  }

  await prisma.like.create({
    data: {
      userId,
      bookLogId,
    },
  });

  const count = await prisma.like.count({
    where: {
      bookLogId,
    },
  });

  return { liked: true, likeCount: count };
};

// 내 좋아요 리스트
export const getMyLikes = async (userId: number) => {
  return prisma.like.findMany({
    where: {
      userId,
    },
    include: {
      bookLog: {
        include: {
          user: {
            select: { id: true, name: true },
          },
          comments: true,
          bookmarks: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};
