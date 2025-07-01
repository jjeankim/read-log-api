import { NextFunction,  Response } from "express";
import jwt from "jsonwebtoken";
import { UserRequest } from "../types/expressUserRequest";

const authenticate = (req: UserRequest, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(404).json({ message: "Unauthorized" });
    return;
  }
  jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET_KEY as string,
    (err, decoded) => {
      if (err) {
        res.status(404).json({ message: "Unauthorized" });
        return;
      }
      req.user = decoded as UserRequest["user"];
    }
  );
};

export default authenticate;
