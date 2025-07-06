import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { UserRequest } from "../types/expressUserRequest";

export const optionalAuthMiddleware = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET_key as string
      );
      req.user = decoded as UserRequest["user"];
    } catch (err) {
      console.warn("토큰 검증 실패: 무시하고 계속 진행합니다.");
    }
  }

  next();
};
