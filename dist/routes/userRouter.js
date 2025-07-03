"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = __importDefault(require("../middlewares/auth"));
const upload_1 = require("../middlewares/upload");
const logController_1 = require("../controllers/logController");
const userRouter = express_1.default.Router();
userRouter
    .get("/me", auth_1.default, userController_1.getMe)
    .get("/my-logs", auth_1.default, logController_1.getMyLogs)
    .patch("/profile", auth_1.default, upload_1.uploadSingle, userController_1.updateProfile);
exports.default = userRouter;
