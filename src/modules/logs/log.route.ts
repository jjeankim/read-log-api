import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  createLog,
  deleteLog,
  getAllLogs,
  getHeatmapStats,
  getLog,
  getMonthLogsStats,
  getMyLogs,
  getSummaryStats,
  getWeeklyLogStats,
  searchLogs,
  updateLog,
} from "./log.controller";

export const logRouter = Router();

logRouter.get("/search", searchLogs);

logRouter.post("/", authMiddleware, createLog);
logRouter.get("/my", authMiddleware, getMyLogs);
logRouter.get("/:logId", getLog);
logRouter.put("/:logId", authMiddleware, updateLog);
logRouter.delete("/:logId", authMiddleware, deleteLog);

logRouter.get("/", getAllLogs);

logRouter.get("/stats/monthly", authMiddleware, getMonthLogsStats);
logRouter.get("/stats/summary", authMiddleware, getSummaryStats);
logRouter.get("/stats/weekly", authMiddleware, getWeeklyLogStats);
logRouter.get("/stats/heatmap", authMiddleware, getHeatmapStats);
