import { RequestHandler, Response } from "express";
import prisma from "../lib/prisma";
import { UserRequest } from "../types/expressUserRequest";

export const createLog = async (req:UserRequest, res:Response) => {
  const userId = req.user.id
  const log = await prisma.log.create({
    data: {
      ...req.body,
      userId,
    },
  });
};


