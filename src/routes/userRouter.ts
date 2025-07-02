import express from "express";
import { getMe, updateProfile } from "../controllers/userController";
import authenticate from "../middlewares/auth";
import { uploadSingle } from "../middlewares/upload";

const userRouter = express.Router();

userRouter
  .get("/me", authenticate, getMe)
  .patch("/profile", authenticate,uploadSingle, updateProfile);

export default userRouter;
