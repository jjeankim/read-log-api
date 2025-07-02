import express from "express";
import { createComment, getComments } from "../controllers/commentController";
import authenticate from "../middlewares/auth";

const commentRouter = express.Router();

commentRouter.route('/:logId/coments').post(authenticate,createComment).get(getComments)
commentRouter.route('comments/:id').patch().delete()

export default commentRouter;