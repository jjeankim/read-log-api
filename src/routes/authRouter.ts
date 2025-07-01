import express from "express";
import { login, register } from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/register", register).post("/login", login);

export default authRouter;
