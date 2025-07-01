import { RequestHandler } from "express"
import prisma from "../lib/prisma"

export const getUser:RequestHandler = async(req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where:{
      id
    }
  })
  res.status(200).json({message:"ok", data: user})
}