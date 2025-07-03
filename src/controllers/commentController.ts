import type { RequestHandler, Response } from "express";
import prisma from "../lib/prisma";
import type { UserRequest } from "../types/expressUserRequest";

export const createComment = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const logId = Number(req.params.logId);
  const { content } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        logId,
      },
    });
    res.status(201).json({ message: "ok", data: comment });
  } catch (error) {
    console.error("댓글 작성 중 에러:", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};

export const getComments: RequestHandler = async (req, res) => {
  const logId = Number(req.params.logId);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  try {
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { logId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where: { logId } }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;
    res.status(200).json({
      message: "댓글 목록 가져오기 성공",
      data: comments,
      pagination: {
        total,
        page,
        totalPages,
        limit,
        hasMore,
      },
    });
  } catch (error) {
    console.error("댓글 목록 가져오기 중 에러:", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};

export const updateComment = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const logId = Number(req.params.logId);
  const commentId = Number(req.params.commentId);
  const { content } = req.body;
  try {
    const comment = await prisma.comment.findFirst({
      where: { id: commentId, logId },
    });
    if (!comment) {
      res.status(404).json({ message: "해당 댓글을 찾을 수 없습니다." });
      return;
    }

    if (comment.logId !== logId) {
      res
        .status(400)
        .json({ message: "댓글이 해당 독후감에 속하지 않습니다." });
      return;
    }

    if (userId !== comment.userId) {
      res.status(403).json({ message: "수정 권한이 없습니다." });
      return;
    }

    const updateComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content,
      },
    });
    res.status(200).json({ message: "댓글 수정 성공", data: updateComment });
  } catch (error) {
    console.error("댓글 작성 중 에러:", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};

// 내 댓글 삭제하기
export const deleteComment = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const logId = Number(req.params.logId);
  const commentId = Number(req.params.commentId);
  try {
    const comment = await prisma.comment.findFirst({
      where: { id: commentId, logId },
    });

    if (!comment) {
      res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
      return;
    }

    console.log(comment.userId);
    console.log(userId);

    if (comment.userId !== userId) {
      res.status(403).json({ message: "삭제 권한이 없습니다." });
      return;
    }

    if (userId !== comment.userId) {
      res.status(403).json({ message: "삭제 권한이 없습니다." });
      return;
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });
    res.sendStatus(204);
  } catch (error) {
    console.error("댓글 삭제 중 에러: ", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};
