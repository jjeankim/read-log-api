import { RequestHandler } from "express";
import prisma from "../lib/prisma";

// 나를 확인하는 방법
export const getMe: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  res.status(200).json({ message: "ok", data: user });
};

export const updateProfile: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  const { password } = req.body;

  const dataToUpdated: any = {};
  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!existingUser) {
    res.status(404).json({ message: "유효하지 않은 사용자입니다." });
  }

  if (password) {
    dataToUpdated.password = password;
  }

  const updateUser = await prisma.user.update({
    where: { id },
    data: dataToUpdated,
  });
  res.status(200).json({ message: "ok", data: updateUser });
};
