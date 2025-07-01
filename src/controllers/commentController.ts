import type { Response } from "express";
import prisma from "../lib/prisma";
import type { UserRequest } from "../types/expressUserRequest";

export const createComment = async (req: UserRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const logId = Number(req.params.id);
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
