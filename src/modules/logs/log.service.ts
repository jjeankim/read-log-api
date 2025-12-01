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
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
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
export const getAllLogs = async (
  sort: "popular" | "recent" | "recommend" = "recent"
) => {
  let orderBy: any = { createdAt: "desc" };

  if (sort === "popular") {
    orderBy = { rating: "desc" };
  }

  if (sort === "recommend") {
    orderBy = {
      likes: {
        _count: "desc",
      },
    };
  }
  return prisma.bookLog.findMany({
    where: { isPublic: true },
    orderBy,
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

// 검색 목록 조회
export const searchLogs = async (query: string) => {
  return prisma.bookLog.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { author: { contains: query } },
        { content: { contains: query } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });
};

// 월별 통계 (월별 작성한 로그 수)
export const getMonthLogsStats = async (userId: number) => {
  const stats = await prisma.$queryRaw<{ month: string; count: number }[]>`
  SELECT
    TO_CHAR("readDate",'MM') AS month,
    COUNT(*)::int AS count
  FROM "BookLog"
  WHERE "userId" = ${userId}
  GROUP BY month
  ORDER BY month
  `;

  return stats;
};

// 통계 요약
export const getSummary = async (userId: number) => {
  const totalLogs = await prisma.bookLog.count({
    where: { userId },
  });

  const monthlyLogs = await prisma.bookLog.count({
    where:{
      userId,
      readDate:{
        gte: new Date(new Date().getFullYear(), new Date().getMonth(),1),
      }
    }
  })

  const avgRatingResult = await prisma.bookLog.aggregate({
    where:{ userId},
    _avg:{rating:true},
  })

  return {
    totalLogs,
    monthlyLogs,
    avgRating: avgRatingResult._avg.rating || 0
  }
};


// 요일 통계
export const getWeeklyLogStats = async (userId: number) => {
  return prisma.$queryRawUnsafe<
    { weekday: string; count: number }[]
  >(
    `
      SELECT 
        TO_CHAR("readDate", 'Dy') AS weekday,
        COUNT(*)::int AS count
      FROM "BookLog"
      WHERE "userId" = $1
      GROUP BY weekday
      ORDER BY weekday;
    `,
    userId
  );
};

// heatmap
export const getHeatmapStats = async (userId: number) => {
  return prisma.$queryRawUnsafe<
    { date: string; count: number }[]
  >(
    `
      SELECT 
        TO_CHAR("readDate", 'YYYY-MM-DD') AS date,
        COUNT(*)::int AS count
      FROM "BookLog"
      WHERE "userId" = $1
        AND EXTRACT(YEAR FROM "readDate") = EXTRACT(YEAR FROM NOW())
      GROUP BY date
      ORDER BY date;
    `,
    userId
  );
};