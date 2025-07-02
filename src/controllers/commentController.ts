import type { RequestHandler, Response } from "express";
import prisma from "../lib/prisma";
import type { UserRequest } from "../types/expressUserRequest";

// 인증된 사용자가 댓글 작성하기
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

// 공개된 로그 목록 가져오기
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

// 내 댓글 수정하기
export const updateComment = async (req:UserRequest, res:Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const id = Number(req.params.id);
  const { content } = req.body;
  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
    });
    if (!comment) {
      res.status(404).json({ message: "해당 댓글을 찾을 수 없습니다." });
      return;
    }

    if (req.user.id !== comment.userId) {
      res.status(403).json({ message: "수정 권한이 없습니다." });
      return;
    }

    const updateComment = await prisma.comment.update({
      where: { id },
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
export const deleteComment = async (req , res) => {
  const id = Number(req.params.id);
}