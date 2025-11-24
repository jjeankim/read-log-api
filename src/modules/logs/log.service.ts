import { prisma } from "../../config/db";

interface CreateLogInput {
  title: string;
  author: string;
  thumbnail?: string;
  rating?: number;
  isDone?: boolean;
  isPublic?: boolean;
  content: string;
  readDate: string;
}

// log 생성
export const createLog = async (userId: number, data: CreateLogInput) => {
  const {
    title,
    author,
    thumbnail,
    rating,
    isDone,
    isPublic,
    content,
    readDate,
  } = data;

  // rating 유효성 검사
  if (rating && (rating < 1 || rating > 5)) {
    throw new Error("평점은 1~5 사이여야 합니다.");
  }

  const log = await prisma.bookLog.create({
    data: {
      userId,
      title,
      author,
      thumbnail,
      rating,
      isDone,
      isPublic,
      content,
      readDate: new Date(readDate),
    },
  });

  return log;
};

// 특정 유저의 독서 기록 리스트
export const getLogsByUser = async (userId: number) => {
  return prisma.bookLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      likes: true,
      bookmarks: true,
    },
  });
};

// 단일 Booklog 조회
export const getLogById = async (logId: number) => {
  return prisma.bookLog.findUnique({
    where: { id: logId },
    include: {
      comments: { include: { user: true } },
    },
  });
};

// BookLog 수정
export const updateLog = async (
  logId: number,
  userId: number,
  data: CreateLogInput
) => {
  const log = await prisma.bookLog.findUnique({
    where: { id: logId },
  });

  if (!log) throw new Error("독서 기록을 찾을 수 없습니다.");
  if (log.userId !== userId) throw new Error("수정 권한이 없습니다.");

  return prisma.bookLog.update({
    where: { id: logId },
    data: {
      ...data,
      readDate: new Date(data.readDate),
    },
  });
};

// BookLog 삭제
export const deleteLog = async (logId: number, userId: number) => {
  const log = await prisma.bookLog.findUnique({
    where: { id: logId },
  });
  if (!log) throw new Error("독서 기록을 찾을 수 없습니다.");
  if (log.userId !== userId) throw new Error("삭제 권한이 없습니다.");

  return prisma.bookLog.delete({ where: { id: logId } });
};

// 공개 BookLog 목록 조회
export const getAllLogs = async () => {
  return prisma.bookLog.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      bookmarks: true,
    },
  });
};
