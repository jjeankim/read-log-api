import { Request, Response } from "express";
import * as userService from "./user.service";
import { UserRequest } from "../../types/expressUserRequest";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken } = await userService.loginUser(req.body);

    res.cookie("refreshToken", refreshToken),
      {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 24 * 7,
      };
      
    res.json({ accessToken });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyProfile = async (req: UserRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "인증 정보가 없습니다." });
    }
    const userId = req.user.id;
    const user = await userService.getMyProfile(userId);

    res.json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
