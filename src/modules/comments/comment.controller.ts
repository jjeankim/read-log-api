import { Response } from "express";
import { UserRequest } from "../../types/expressUserRequest";
import * as commentService from "../comments/comment.service";

export const createComment = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const bookLogId = Number(req.params.logId);

    const comment = await commentService.createComment(
      userId,
      bookLogId,
      req.body
    );
    res.status(201).json(comment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getCommentByLog = async (req: UserRequest, res: Response) => {
  try {
    const bookLogId = Number(req.params.logId);

    const comments = await commentService.getCommentByLog(bookLogId);
    res.json(comments);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updeateComment = async (req: UserRequest, res: Response) => {
  try {
    const commentId = Number(req.params.commentId);
    const userId = req.user!.id;

    const updated = await commentService.updateComment(
      commentId,
      userId,
      req.body.content
    );

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteComment = async (req: UserRequest, res: Response) => {
  try {
    const commentId = Number(req.params.commentId);
    const userId = req.user!.id;

    const deleted = await commentService.deleteComment(commentId, userId);
    res.json(deleted);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
