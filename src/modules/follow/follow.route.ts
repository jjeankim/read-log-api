import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { followUser, getMyFollowers, getMyFollowings, unfollowUser } from "./follow.controller";

export const followRouter = Router()

followRouter.post("/:userId",authMiddleware,followUser)
followRouter.delete("/:userId",authMiddleware,unfollowUser)

followRouter.get("/followings",authMiddleware,getMyFollowings)
followRouter.get("/followers",authMiddleware,getMyFollowers)