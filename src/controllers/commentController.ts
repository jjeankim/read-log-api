import type { RequestHandler, Response } from "express";
import prisma from "../lib/prisma";
import type { UserRequest } from "../types/expressUserRequest";

export const createComment = async (req: UserRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const logId = Number(req.params.logId);
  const { content } = req.body;
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        userId: req.user.id,
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
  try {
    const comments = await prisma.comment.findMany({
      where: { logId },
    });
    res
      .status(200)
      .json({ message: "댓글 목록 가져오기 성공", data: comments });
  } catch (error) {
    console.error("댓글 목록 가져오기 중 에러:", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};
