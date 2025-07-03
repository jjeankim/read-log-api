import express, { NextFunction, Request, Response } from "express";
import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
import cookieParser from "cookie-parser";
import prisma from "./lib/prisma";
import logRouter from "./routes/logRouter";
import dotenv from "dotenv";
import commentRouter from "./routes/commentRouter";
dotenv.config();
import cors from "cors";
import { uploadPath } from "./middlewares/upload";

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/logs", logRouter);
app.use("/logs/:logId/comments", commentRouter);
app.use("/uploads", express.static(uploadPath));

app.use((req: Request, res: Response, next: NextFunction) => {
  res
    .status(404)
    .json({ message: "요청하신 리소스를 찾을 수 없습니다.", status: "Fail" });
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error.stack());
  res.status(500).json(`sever error ${error.stack}, status: "Error`);
});

app.listen(3000, () => {
  console.log("Server started!");
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Prisam 연결 종료");
  process.exit();
});
