import { RequestHandler } from "express";
import { loginSchema, registerSchema } from "../validators/authSchema";

export const validateRegister:RequestHandler = (req, res, next) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "회원가입 유효성 검사 실패",
      error: result.error.format(),
    });

    return;
  }

  next();
};

export const validateLogin:RequestHandler = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res
      .status(400)
      .json({
        message: "로그인 유효성 검사 실패",
        error: result.error.format(),
      });

      return;
  }
  next()
};
