import express from "express";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/commentController";
import authenticate from "../middlewares/auth";

const commentRouter = express.Router();

commentRouter
  .route("/")
  .post(authenticate, createComment)
  .get(getComments);
commentRouter
  .route("/:id")
  .patch(authenticate, updateComment)
  .delete(authenticate, deleteComment);

export default commentRouter;
