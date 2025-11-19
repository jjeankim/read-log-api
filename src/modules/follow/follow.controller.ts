import { Response } from "express";
import { UserRequest } from "../../types/expressUserRequest";
import * as followService from "../follow/follow.service";

export const followUser = async (req: UserRequest, res: Response) => {
  try {
    const followerId = req.user!.id;
    const followingId = Number(req.params.userId);

    const result = await followService.followUser(followerId, followingId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const unfollowUser = async (req: UserRequest, res: Response) => {
  try {
    const followerId = req.user!.id;
    const followingId = Number(req.params.userId);
    const result = await followService.unfollowUser(followerId, followingId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyFollowings = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const followings = await followService.getMyFollowings(userId);
    res.json(followings);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyFollowers = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const followers = await followService.getMyFollowers(userId);
    res.json(followers);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
