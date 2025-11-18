import { Response } from "express";
import { UserRequest } from "../../types/expressUserRequest";
import * as likeService from "../like/like.service";

export const toggleLike = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const bookLogId = Number(req.params.logId);
    const result = await likeService.toggleLike(userId, bookLogId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyLikes = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const likes = await likeService.getMyLikes(userId);
    res.json(likes);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
