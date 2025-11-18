import { Response } from "express";
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
    const logs = await logService.getLogsByUser(userId)
    res.json(logs)
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getLog = async (req: UserRequest, res: Response) => {
  try {
    const logId = Number(req.params.id);
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
export const getAllLogs = async(req:UserRequest, res:Response)=> {
  try {
    const logs = await logService.getAllLogs();
    res.json(logs)
  } catch (error:any) {
    res.status(400).json({message:error.message})
  }
}