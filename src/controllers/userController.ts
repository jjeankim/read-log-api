import type { Response } from "express";
import prisma from "../lib/prisma";
import type { UserRequest } from "../types/expressUserRequest";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs"

export const getMe = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if(!userId) {
    res.status(401).json({message:"Unauthorized"})
    return
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    res.status(200).json({ message: "ok", data: user });
  } catch (error) {
    console.error("내 정보 가져오기 중 에러:", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};

export const updateProfile = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if(!userId) {
    res.status(401).json({message:"Unauthorized"})
    return
  }

  const { password } = req.body;
  const profile = req.file?.filename;

  const dataToUpdated: any = {};
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id:userId,
      },
    });

    if (!existingUser) {
      res.status(404).json({ message: "유효하지 않은 사용자입니다." });
      return;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      dataToUpdated.password = hashedPassword;
    }

    if (profile && existingUser.profile) {
      const uploadDir = path.join(__dirname, "../public/uploads");
      const oldFilePath = path.join(uploadDir, existingUser.profile);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      dataToUpdated.profile = profile;
    } else if (profile) {
      dataToUpdated.profile = profile;
    }

    const updateUser = await prisma.user.update({
      where: { id:userId },
      data: dataToUpdated,
    });
    res.status(200).json({ message: "ok", data: updateUser });
  } catch (error) {
    console.error("프로필 업데이트 중 에러:", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};
