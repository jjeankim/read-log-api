import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { getMyBookmarks, toggleBookmark } from "./bookmark.controller";

export const bookmarkRouter = Router()

bookmarkRouter.post("/:logId",authMiddleware,toggleBookmark)
bookmarkRouter.get("/my",authMiddleware,getMyBookmarks)