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
import { authOptional } from "../middlewares/authOptional";

const logRouter = express.Router();

logRouter.route("/").post(authenticate,uploadMultiple, createLog).get(getLogs);

logRouter
  .route("/:logId")
  .get(authOptional,getLog)
  .put(authenticate, uploadMultiple,updateLog)
  .delete(authenticate, deleteLog);

logRouter.get("/my-logs", authenticate, getMyLogs)
  
export default logRouter;
