import express from "express";
import { userRouter } from "./modules/users/user.route";
import { logRouter } from "./modules/logs/log.route";
import { commentRouter } from "./modules/comments/comment.route";
import { bookmarkRouter } from "./modules/bookmark/bookmark.route";

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/logs", logRouter);
app.use("/comments", commentRouter);
app.use("/bookmarks", bookmarkRouter);

app.listen(4000, () => console.log("Server Started!"));
