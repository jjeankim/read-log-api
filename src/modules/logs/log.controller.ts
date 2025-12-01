import { Request, Response } from "express";
import { UserRequest } from "../../types/expressUserRequest";
import * as logService from "../logs/log.service";

export const createLog = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const log = await logService.createLog(userId, req.body);
    res.status(201).json(log);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyLogs = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const logs = await logService.getLogsByUser(userId);
    res.json(logs);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getLog = async (req: UserRequest, res: Response) => {
  try {
    const logId = Number(req.params.logId);
    const log = await logService.getLogById(logId);
    res.json(log);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateLog = async (req: UserRequest, res: Response) => {
  try {
    const logId = Number(req.params.id);
    const userId = req.user!.id;
    const updated = await logService.updateLog(logId, userId, req.body);

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteLog = async (req: UserRequest, res: Response) => {
  try {
    const logId = Number(req.params.id);
    const userId = req.user!.id;
    await logService.deleteLog(logId, userId);
    res.json({ message: "독서 기록이 삭제되었습니다." });
  } catch (error) {}
};

// 공개 로그 목록 조회
export const getAllLogs = async (req: UserRequest, res: Response) => {
  try {
    const sort = req.query.sort as "popular" | "recent" | "recommend";
    const logs = await logService.getAllLogs(sort);
    res.json(logs);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// 검색 로그 조회
export const searchLogs = async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "검색어가 없습니다." });
    }

    const result = await logService.searchLogs(query.trim());
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// 월별 통계
export const getMonthLogsStats = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const stats = await logService.getMonthLogsStats(userId);
    return res.json(stats);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// 통계 요약
export const getSummaryStats = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const summary = await logService.getSummary(userId);
    return res.json(summary);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "요약 통계 조회 실패" });
  }
};

// 요일 통계
export const getWeeklyLogStats = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const stats = await logService.getWeeklyLogStats(userId);
    return res.json(stats);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "요일별 통계 조회 실패" });
  }
};

// 연간 히트맵 통계
export const getHeatmapStats = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const stats = await logService.getHeatmapStats(userId);
    return res.json(stats);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "히트맵 통계 조회 실패" });
  }
};