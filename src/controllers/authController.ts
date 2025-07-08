import type { Request, Response, RequestHandler } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../lib/token";
import { ERROR_MESSAGE, SUCCESS_MESSAGES } from "../constants/message";
import { loginSchema, registerSchema } from "../validators/authSchema";
import { ZodError } from "zod";

export const register: RequestHandler = async (req, res) => {
  try {
    const { email, username, password } = registerSchema.parse(req.body);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: SUCCESS_MESSAGES.OK, data: user });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: ERROR_MESSAGE.INVALID_INPUT,
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
      return;
    }

    console.error("회원가입 중 에러:", error);
    res.status(500).json({ message: ERROR_MESSAGE.SERVER_ERROR });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ message: ERROR_MESSAGE.USER_NOT_FOUND });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: ERROR_MESSAGE.INVALID_CREDENTIALS });
      return;
    }

    const { accessToken, refreshToken } = generateToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: SUCCESS_MESSAGES.OK, accessToken });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: ERROR_MESSAGE.INVALID_INPUT,
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
      return;
    }
    console.error("로인인 중 에러:", error);
    res.status(500).json({ message: ERROR_MESSAGE.SERVER_ERROR });
  }
};

export const logout: RequestHandler = (req, res) => {
  try {

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
    });
    res.json({ message: SUCCESS_MESSAGES.LOGGED_OUT });
  } catch (error) {
    console.error("로그아웃 중 에러:",error)
    res.json(500).json({message:ERROR_MESSAGE.SERVER_ERROR})
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401).json({ message: ERROR_MESSAGE.TOKEN_MISSING });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET_KEY as string
    ) as { id: number };
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      res.status(401).json({ message: ERROR_MESSAGE.UNAUTHORIZED });
      return;
    }

    const { accessToken, refreshToken } = generateToken(user);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    if(error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({message:ERROR_MESSAGE.TOKEN_INVALID})
      return
    }
    console.error("토큰 갱신 중 에러:", error);
    res.status(500).json({ message: ERROR_MESSAGE.SERVER_ERROR });
  }
};
