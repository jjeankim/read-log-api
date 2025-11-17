import { prisma } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

interface LoginInput {
  email: string;
  password: string;
}

// user 생성
export const createUser = async (data: CreateUserInput) => {
  const { email, password, name } = data;

  const exist = await prisma.user.findUnique({
    where: { email },
  });

  if (exist) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
  return user;
};

// login
export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new Error("사용자가 존재하지 않습니다.");
  }

  // 비밀번호 확인
  const isValida = await bcrypt.compare(password, user.passwordHash);
  if (!isValida) {
    throw new Error("비밀번호가 틀렸습니다.");
  }

  //jwt 토큰 발급
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
};

// 내 프로필 조회
export const getMyProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
  return user;
};
