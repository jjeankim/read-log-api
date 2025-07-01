import type { Response, RequestHandler } from "express";
import prisma from "../lib/prisma";
import type { UserRequest } from "../types/expressUserRequest";

export const getMe = async (req: UserRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
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

// 패스워드 수정만 넣은 상태로 이미지 수정도 해야함
export const updateProfile: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  const { password } = req.body;

  const dataToUpdated: any = {};
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      res.status(404).json({ message: "유효하지 않은 사용자입니다." });
      return;
    }

    if (password) {
      dataToUpdated.password = password;
    }

    const updateUser = await prisma.user.update({
      where: { id },
      data: dataToUpdated,
    });
    res.status(200).json({ message: "ok", data: updateUser });
  } catch (error) {
    console.error("프로필 업데이트 중 에러:", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};
