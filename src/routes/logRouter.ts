import express from "express";
import {
  createLog,
  deleteLog,
  getLog,
  getLogs,
  updateLog,
} from "../controllers/logController";
import authenticate from "../middlewares/auth";

const logRouter = express.Router();

logRouter.route("/").post(authenticate, createLog).get(getLogs);

logRouter
  .route("/:id")
  .get(getLog)
  .put(authenticate, updateLog)
  .delete(authenticate, deleteLog);
  
export default logRouter;
