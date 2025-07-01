import express from "express";
import { getMe, updateProfile } from "../controllers/userController";
import authenticate from "../middlewares/auth";

const userRouter = express.Router();

userRouter
  .get("/me", authenticate, getMe)
  .patch("/profile", authenticate, updateProfile);

export default userRouter;
