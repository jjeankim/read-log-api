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
exports.deleteComment = exports.updateComment = exports.getComments = exports.createComment = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
// 인증된 사용자가 댓글 작성하기
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const logId = Number(req.params.logId);
    const { content } = req.body;
    try {
        const comment = yield prisma_1.default.comment.create({
            data: {
                content,
                userId,
                logId,
            },
        });
        res.status(201).json({ message: "ok", data: comment });
    }
    catch (error) {
        console.error("댓글 작성 중 에러:", error);
        res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
    }
});
exports.createComment = createComment;
// 공개된 로그 목록 가져오기
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const logId = Number(req.params.logId);
    try {
        const comments = yield prisma_1.default.comment.findMany({
            where: { logId },
        });
        res
            .status(200)
            .json({ message: "댓글 목록 가져오기 성공", data: comments });
    }
    catch (error) {
        console.error("댓글 목록 가져오기 중 에러:", error);
        res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
    }
});
exports.getComments = getComments;
// 내 댓글 수정하기
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const logId = Number(req.params.logId);
    const commentId = Number(req.params.commentId);
    const { content } = req.body;
    try {
        const comment = yield prisma_1.default.comment.findFirst({
            where: { id: commentId, logId },
        });
        if (!comment) {
            res.status(404).json({ message: "해당 댓글을 찾을 수 없습니다." });
            return;
        }
        if (comment.logId !== logId) {
            res
                .status(400)
                .json({ message: "댓글이 해당 독후감에 속하지 않습니다." });
            return;
        }
        if (userId !== comment.userId) {
            res.status(403).json({ message: "수정 권한이 없습니다." });
            return;
        }
        const updateComment = yield prisma_1.default.comment.update({
            where: { id: commentId },
            data: {
                content,
            },
        });
        res.status(200).json({ message: "댓글 수정 성공", data: updateComment });
    }
    catch (error) {
        console.error("댓글 작성 중 에러:", error);
        res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
    }
});
exports.updateComment = updateComment;
// 내 댓글 삭제하기
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const logId = Number(req.params.logId);
    const commentId = Number(req.params.commentId);
    try {
        const comment = yield prisma_1.default.comment.findFirst({
            where: { id: commentId, logId },
        });
        if (!comment) {
            res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
            return;
        }
        console.log(comment.userId);
        console.log(userId);
        if (comment.userId !== userId) {
            res.status(403).json({ message: "삭제 권한이 없습니다." });
            return;
        }
        if (userId !== comment.userId) {
            res.status(403).json({ message: "삭제 권한이 없습니다." });
            return;
        }
        yield prisma_1.default.comment.delete({
            where: { id: commentId },
        });
        res.sendStatus(204);
    }
    catch (error) {
        console.error("댓글 삭제 중 에러: ", error);
        res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
    }
});
exports.deleteComment = deleteComment;
