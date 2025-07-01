import jwt from "jsonwebtoken";
import { User } from "../types/userType";

const generateToken = (user: User) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_ACCESS_SECRET_KEY as string,
    {
      expiresIn: "7d",
    }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_REFRESH_SECRET_KEY as string,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};

export default generateToken;
