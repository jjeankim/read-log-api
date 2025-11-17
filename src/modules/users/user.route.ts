import { Router } from "express";
import { createUser, getMyProfile, loginUser } from "./user.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

export const userRouter = Router();

userRouter.post("/signup", createUser);
userRouter.post("/login", loginUser);

userRouter.get("/me", authMiddleware, getMyProfile);
