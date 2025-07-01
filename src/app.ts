import express from "express";
import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
import cookieParser from "cookie-parser";
import prisma from "./lib/prisma";
import logRouter from "./routes/logRouter";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/logs",logRouter);



app.listen(3000, () => {
  console.log("Server started!");
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Prisam 연결 종료");
  process.exit();
});