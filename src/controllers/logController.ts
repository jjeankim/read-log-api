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
    where: {isPublic: true,},
    orderBy:{createdAt: "desc"}
  });
  res.status(200).json({ message: "log 목록 가져오기 성공", data: logs });
};

export const getLog: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  const log = await prisma.log.findFirst({
    where: { id, isPublic: true },
  });
  if(!log) {
    res.status(404).json({message:"해당 공개 로그를 찾을 수 없습니다."})
  }
  
  res.status(200).json({ message: "ok", data: log });
};
