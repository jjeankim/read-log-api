import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { getMyLikes, toggleLike } from "./like.controller";

export const likeRouter = Router()

likeRouter.post("/:logId",authMiddleware,toggleLike);
likeRouter.get("/my",authMiddleware,getMyLikes)