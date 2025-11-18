import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  createComment,
  deleteComment,
  getCommentByLog,
  updeateComment,
} from "./comment.controller";

export const commentRouter = Router();

commentRouter.post("/log/:logId", authMiddleware, createComment);
commentRouter.get("/log/:logId", getCommentByLog);
commentRouter.put("/:commentId", authMiddleware, updeateComment);
commentRouter.delete("/:commentId", authMiddleware, deleteComment);
