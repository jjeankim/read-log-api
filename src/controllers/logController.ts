import { RequestHandler, Response } from "express";
import prisma from "../lib/prisma";
import { UserRequest } from "../types/expressUserRequest";

export const createLog = async (req: UserRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { title, content, bookImgUrl, bookAuthor, rating } = req.body;

  const log = await prisma.log.create({
    data: {
      title,
      content,
      bookImgUrl,
      bookAuthor,
      rating,
      userId: req.user.id,
    },
  });

  res.status(201).json({ data: log });
};

export const getLogs: RequestHandler = async (req, res) => {
  const logs = await prisma.log.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json({ message: "log 목록 가져오기 성공", data: logs });
};

export const getLog: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  const log = await prisma.log.findFirst({
    where: { id, isPublic: true },
  });
  if (!log) {
    res.status(404).json({ message: "해당 공개 로그를 찾을 수 없습니다." });
  }

  res.status(200).json({ message: "ok", data: log });
};

export const updateLog = async (req: UserRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const id = Number(req.params.id);
  const log = await prisma.log.findUnique({
    where: { id },
  });
  if (!log) {
    res.status(404).json({ message: "해당 로그를 찾을 수 없습니다." });
  }

  if (req.user.id !== log?.userId) {
    res.status(404).json({ message: "수정 권한이 없습니다." });
  }

  const { title, content, bookAuthor, bookImgUrl, rating } = req.body;
  const updatedLog = await prisma.log.update({
    where: { id },
    data: {
      title,
      content,
      bookAuthor,
      bookImgUrl,
      rating,
    },
  });
  res.status(200).json({ message: "로그 수정 성공", data: updatedLog });
};

export const deleteLog = async (req: UserRequest, res: Response) => {
  const id = Number(req.params.id);
  try {
    const log = await prisma.log.delete({
      where: { id },
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: "서버 오류", error });
  }
};
