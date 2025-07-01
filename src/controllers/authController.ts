import type { Request, RequestHandler, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../lib/token";

export const register: RequestHandler = async (req, res) => {
  const { email, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  });

  res.status(201).json({ message: "ok", data: user });
};

// 확인해보기
export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    res.status(401).json({ message: "Invalid email" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401).json({ message: " Invalid email & password" });
    return;
  }

  const { accessToken, refreshToken } = generateToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ message: "ok", accessToken });
};

export const logout: RequestHandler = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.json({ message: "Logged out" });
};

export const refreshToken:RequestHandler = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401).json({ message: "리프레시 토큰이 없습니다." })
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
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." })
      return
    }

    const { accessToken, refreshToken } = generateToken(user);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: "유효하지 않은 " });
  }
};
