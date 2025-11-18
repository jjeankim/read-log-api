import { Response } from "express";
import { UserRequest } from "../../types/expressUserRequest";
import * as bookmarkService from "../bookmark/bookmark.service";

export const toggleBookmark = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const bookLogId = Number(req.params.logId);

    const result = await bookmarkService.toggleBookmark(userId, bookLogId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyBookmarks = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const bookmarks = await bookmarkService.getMyBookmarks(userId);
    res.json(bookmarks);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
