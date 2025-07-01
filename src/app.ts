import express, { Request, Response } from "express";
import userRouter from "./routes/userRoute";
import authRouter from "./routes/authRouter";

const app = express();
app.use(express.json());

app.use('/users',userRouter)
app.use('/auth',authRouter)


app.listen(3000, () => {
  console.log("Server started!");
});
