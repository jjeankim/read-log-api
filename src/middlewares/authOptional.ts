import jwt from "jsonwebtoken";
import type { UserRequest } from "../types/expressUserRequest";
import type { NextFunction, Response } from "express";

export const authOptional = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_SECRET_KEY as string
      );
      req.user = decoded as UserRequest["user"];
    } catch (error) {}
  }
  next();
};
