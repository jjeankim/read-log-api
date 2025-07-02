import express from "express";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/commentController";
import authenticate from "../middlewares/auth";

const commentRouter = express.Router({mergeParams:true});

commentRouter
  .route("/")
  .post(authenticate, createComment)
  .get(getComments);
commentRouter
  .route("/:commentId")
  .patch(authenticate, updateComment)
  .delete(authenticate, deleteComment);

export default commentRouter;
