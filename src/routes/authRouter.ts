import express from "express";
import { login, register } from "../controllers/authController";
import { validateLogin, validateRegister } from "../middlewares/validation";

const authRouter = express.Router();

authRouter
  .post("/register", validateRegister, register)
  .post("/login", validateLogin, login);

export default authRouter;
