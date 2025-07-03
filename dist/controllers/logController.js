"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLog = exports.updateLog = exports.getMyLogs = exports.getLog = exports.getLogs = exports.createLog = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const createLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { title, content, bookAuthor, rating, isPublic } = req.body;
    const ratingInt = Number(rating);
    const isPublicBoolean = isPublic === "true";
    const files = req.files || undefined;
    const images = (files === null || files === void 0 ? void 0 : files.map((file) => file.filename)) || [];
    try {
        const log = yield prisma_1.default.log.create({
            data: {
                title,
                content,
                bookImgUrl: images,
                bookAuthor,
                rating: ratingInt,
                userId: req.user.id,
                isPublic: isPublicBoolean,
            },
        });
        res.status(201).json({ message: "ok", data: log });
    }
    catch (error) {
        console.error("로그 작성 중 에러:", error);
        res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
    }
});
exports.createLog = createLog;
const getLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const [logs, total] = yield Promise.all([
            prisma_1.default.log.findMany({
                where: { isPublic: true },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma_1.default.log.count({
                where: { isPublic: true },
            }),
        ]);
        const totalPage = Math.ceil(total / limit);
        const hasMore = page < totalPage;
        res.status(200).json({
            message: "log 목록 가져오기 성공",
            data: logs,
            pagination: {
                total,
                page,
                totalPage,
                limit,
                hasMore,
            },
        });
    }
    catch (error) {
        console.error("로그 목록 가져오기 중 에러:", error);
        res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
    }
});
exports.getLogs = getLogs;
const getLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const logId = Number(req.params.logId);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const log = yield prisma_1.default.log.findFirst({
            where: { id: logId },
        });
        if (!log) {
            res.status(404).json({ message: "해당 공개 로그를 찾을 수 없습니다." });
            return;
        }
        if (!log.isPublic && log.userId !== userId) {
            res.status(403).json({ message: "비공개 로그에 접근할 수 없습니다." });
            return;
        }
        res.status(200).json({ message: "ok", data: log });
    }
    catch (error) {
        console.error("로그 가져오기 중 에러:", error);
        res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
    }
});
exports.getLog = getLog;
const getMyLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const [logs, total] = yield Promise.all([
            prisma_1.default.log.findMany({
                where: { userId: req.user.id },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma_1.default.log.count({
                where: { userId: req.user.id },
            }),
        ]);
        const totalPages = Math.ceil(total / limit);
        const hasMore = page < totalPages;
        res.status(200).json({
            message: "내 로그 목록 가져오기 성공",
            data: logs,
            pagination: {
                total,
                page,
                totalPages,
                limit,
                hasMore,
            },
        });
    }
    catch (error) {
        console.error("내 로그 목록 가져오기 중 에러:", error);
        res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
    }
});
exports.getMyLogs = getMyLogs;
const updateLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const logId = Number(req.params.logId);
    const { title, content, bookAuthor, bookImgUrl, rating, isPublic } = req.body;
    const ratingInt = Number(rating);
    const isPublicBoolean = isPublic === "true";
    try {
        const log = yield prisma_1.default.log.findUnique({
            where: { id: logId },
        });
        if (!log) {
            res.status(404).json({ message: "해당 로그를 찾을 수 없습니다." });
            return;
        }
        if (req.user.id !== (log === null || log === void 0 ? void 0 : log.userId)) {
            res.status(404).json({ message: "수정 권한이 없습니다." });
            return;
        }
        const updatedLog = yield prisma_1.default.log.update({
            where: { id: logId },
            data: {
                title,
                content,
                bookAuthor,
                bookImgUrl,
                rating: ratingInt,
                isPublic: isPublicBoolean,
            },
        });
        res.status(200).json({ message: "로그 수정 성공", data: updatedLog });
    }
    catch (error) {
        console.error("로그 수정 중 에러:", error);
        res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
    }
});
exports.updateLog = updateLog;
const deleteLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const logId = Number(req.params.logId);
    try {
        const log = yield prisma_1.default.log.findUnique({
            where: { id: logId },
        });
        if (req.user.id !== (log === null || log === void 0 ? void 0 : log.userId)) {
            res.status(403).json({ message: "삭제 권한이 없습니다." });
            return;
        }
        yield prisma_1.default.log.delete({
            where: { id: logId },
        });
        res.sendStatus(204);
    }
    catch (error) {
        console.error("로그 삭제 중 에러:", error);
        res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
    }
});
exports.deleteLog = deleteLog;
