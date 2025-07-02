"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middlewares/validation");
const authRouter = express_1.default.Router();
authRouter
    .post("/register", validation_1.validateRegister, authController_1.register)
    .post("/login", validation_1.validateLogin, authController_1.login)
    .post("/logout", authController_1.logout)
    .post("/tokens", authController_1.refreshToken);
exports.default = authRouter;
