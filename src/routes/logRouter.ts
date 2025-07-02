import express from "express";
import {
  createLog,
  deleteLog,
  getLog,
  getLogs,
  updateLog,
} from "../controllers/logController";
import authenticate from "../middlewares/auth";
import { uploadMultiple } from "../middlewares/upload";

const logRouter = express.Router();

logRouter.route("/").post(authenticate,uploadMultiple, createLog).get(getLogs);

logRouter
  .route("/:logId")
  .get(getLog)
  .put(authenticate, uploadMultiple,updateLog)
  .delete(authenticate, deleteLog);
  
export default logRouter;
