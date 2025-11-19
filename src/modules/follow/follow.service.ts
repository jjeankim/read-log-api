import { prisma } from "../../config/db";

export const followUser = async (followerId: number, followingId: number) => {
  if (followerId === followingId) {
    throw new Error("자기 자신을 팔로우할 수 없습니다.");
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (existing) {
    throw new Error("이미 팔로우 중입니다.");
  }

  await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });
  return { followed: true };
};

export const unfollowUser = async (followerId: number, followingId: number) => {
  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
  if (!existing) {
    throw new Error("팔로우 상태가 아닙니다.");
  }

  await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  return { followed: false };
};

// 내가 팔로우 한 목록 조회
export const getMyFollowings = async (userId: number) => {
  return prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      follower: {
        select: { id: true, name: true },
      },
    },
  });
};

// 나를 팔로우한 사람들 목록
export const getMyFollowers = async (userId: number) => {
  return prisma.follow.findMany({
    where: {
      followingId: userId,
    },
    include: { follower: { select: { id: true, name: true } } },
  });
};
