import express from "express";
import { createLog, getLog, getLogs } from "../controllers/logController";
import authenticate from "../middlewares/auth";

const logRouter = express.Router();

logRouter.route("/").post(authenticate, createLog).get(getLogs);

logRouter.route("/:id").get(getLog)
export default logRouter;
