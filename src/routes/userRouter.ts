import express from "express";
import { getMe, updateProfile } from "../controllers/userController";
import authenticate from "../middlewares/auth";
import { uploadSingle } from "../middlewares/upload";
import { getMyLogs } from "../controllers/logController";

const userRouter = express.Router();

userRouter
  .get("/me", authenticate, getMe)
  .get("/my-logs", authenticate, getMyLogs)
  .patch("/profile", authenticate, uploadSingle, updateProfile);

export default userRouter;
