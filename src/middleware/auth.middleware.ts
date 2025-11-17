import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserRequest } from "../types/expressUserRequest";

interface JwtPayload {
  id: number;
  email: string;
}

export const authMiddleware = (
  req: UserRequest ,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "토큰이 유효하지 않습니다." });
  }
};
