import express from "express";
import { login, logout, refreshToken, register } from "../controllers/authController";
import { validateLogin, validateRegister } from "../middlewares/validation";

const authRouter = express.Router();

authRouter
  .post("/register", validateRegister, register)
  .post("/login", validateLogin, login)
  .post("/logout",logout)
  .post("/tokens",refreshToken)

export default authRouter;
