import express from "express";
import {
  createLog,
  deleteLog,
  getLog,
  getLogs,
  getMyLogs,
  updateLog,
} from "../controllers/logController";
import authenticate from "../middlewares/auth";
import { uploadMultiple } from "../middlewares/upload";
import { optionalAuthMiddleware } from "../middlewares/optionalAuthMiddleware";

const logRouter = express.Router();

logRouter.route("/").post(authenticate, uploadMultiple, createLog).get(getLogs);

logRouter
  .route("/:logId")
  .get(optionalAuthMiddleware, getLog)
  .put(authenticate, uploadMultiple, updateLog)
  .delete(authenticate, deleteLog);

logRouter.get("/my-logs", authenticate, getMyLogs);

export default logRouter;
