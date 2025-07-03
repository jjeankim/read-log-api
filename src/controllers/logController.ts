import type { RequestHandler, Response } from "express";
import prisma from "../lib/prisma";
import type { UserRequest } from "../types/expressUserRequest";

export const createLog = async (req: UserRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { title, content, bookAuthor, rating, isPublic } = req.body;

  const ratingInt = Number(rating);
  const isPublicBoolean = isPublic === "true";
  const files = (req.files as Express.Multer.File[]) || undefined;

  const images = files?.map((file) => file.filename) || [];

  try {
    const log = await prisma.log.create({
      data: {
        title,
        content,
        bookImgUrl: images,
        bookAuthor,
        rating: ratingInt,
        userId: req.user.id,
        isPublic: isPublicBoolean,
      },
    });

    res.status(201).json({ message: "ok", data: log });
  } catch (error) {
    console.error("로그 작성 중 에러:", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};

export const getLogs: RequestHandler = async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  try {
    const [logs, total] = await Promise.all([
      prisma.log.findMany({
        where: { isPublic: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.log.count({
        where: { isPublic: true },
      }),
    ]);
    const totalPage = Math.ceil(total / limit);
    const hasMore = page < totalPage;

    res.status(200).json({
      message: "log 목록 가져오기 성공",
      data: logs,
      pagination: {
        total,
        page,
        totalPage,
        limit,
        hasMore,
      },
    });
  } catch (error) {
    console.error("로그 목록 가져오기 중 에러:", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};

export const getLog = async (req: UserRequest, res: Response) => {
  const logId = Number(req.params.logId);
  const userId = req.user?.id;

  try {
    const log = await prisma.log.findUnique({
      where: { id: logId },
    });
    if (!log) {
      res.status(404).json({ message: "해당 공개 로그를 찾을 수 없습니다." });
      return;
    }
    if (!log.isPublic && log.userId !== userId) {
      res.status(403).json({ message: "비공개 로그에 접근할 수 없습니다." });

      return;
    }

    res.status(200).json({ message: "ok", data: log });
  } catch (error) {
    console.error("로그 가져오기 중 에러:", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};

export const getMyLogs = async (req: UserRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  try {
    const [logs, total] = await Promise.all([
      prisma.log.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.log.count({
        where: { userId: req.user.id },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;
    res.status(200).json({
      message: "내 로그 목록 가져오기 성공",
      data: logs,
      pagination: {
        total,
        page,
        totalPages,
        limit,
        hasMore,
      },
    });
  } catch (error) {
    console.error("내 로그 목록 가져오기 중 에러:", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};

export const updateLog = async (req: UserRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const logId = Number(req.params.logId);
  const { title, content, bookAuthor, bookImgUrl, rating, isPublic } = req.body;

  const ratingInt = Number(rating);
  const isPublicBoolean = isPublic === "true";
  try {
    const log = await prisma.log.findUnique({
      where: { id: logId },
    });
    if (!log) {
      res.status(404).json({ message: "해당 로그를 찾을 수 없습니다." });
      return;
    }

    if (req.user.id !== log?.userId) {
      res.status(404).json({ message: "수정 권한이 없습니다." });
      return;
    }

    const updatedLog = await prisma.log.update({
      where: { id: logId },
      data: {
        title,
        content,
        bookAuthor,
        bookImgUrl,
        rating: ratingInt,
        isPublic: isPublicBoolean,
      },
    });
    res.status(200).json({ message: "로그 수정 성공", data: updatedLog });
  } catch (error) {
    console.error("로그 수정 중 에러:", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};

export const deleteLog = async (req: UserRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const logId = Number(req.params.logId);
  try {
    const log = await prisma.log.findUnique({
      where: { id: logId },
    });

    if (req.user.id !== log?.userId) {
      res.status(403).json({ message: "삭제 권한이 없습니다." });
      return;
    }

    await prisma.log.delete({
      where: { id: logId },
    });

    res.sendStatus(204);
  } catch (error) {
    console.error("로그 삭제 중 에러:", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};
