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
exports.updateProfile = exports.getMe = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
            return;
        }
        res.status(200).json({ message: "ok", data: user });
    }
    catch (error) {
        console.error("내 정보 가져오기 중 에러:", error);
        res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
    }
});
exports.getMe = getMe;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { password } = req.body;
    const profile = (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename;
    const dataToUpdated = {};
    try {
        const existingUser = yield prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!existingUser) {
            res.status(404).json({ message: "유효하지 않은 사용자입니다." });
            return;
        }
        if (password) {
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            dataToUpdated.password = hashedPassword;
        }
        if (profile && existingUser.profile) {
            const uploadDir = path_1.default.join(__dirname, "../public/uploads");
            const oldFilePath = path_1.default.join(uploadDir, existingUser.profile);
            if (fs_1.default.existsSync(oldFilePath)) {
                fs_1.default.unlinkSync(oldFilePath);
            }
            dataToUpdated.profile = profile;
        }
        else if (profile) {
            dataToUpdated.profile = profile;
        }
        const updateUser = yield prisma_1.default.user.update({
            where: { id: userId },
            data: dataToUpdated,
        });
        res.status(200).json({ message: "ok", data: updateUser });
    }
    catch (error) {
        console.error("프로필 업데이트 중 에러:", error);
        res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
    }
});
exports.updateProfile = updateProfile;
