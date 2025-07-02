"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegister = void 0;
const authSchema_1 = require("../validators/authSchema");
const validateRegister = (req, res, next) => {
    const result = authSchema_1.registerSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            message: "회원가입 유효성 검사 실패",
            error: result.error.format(),
        });
        return;
    }
    next();
};
exports.validateRegister = validateRegister;
const validateLogin = (req, res, next) => {
    const result = authSchema_1.loginSchema.safeParse(req.body);
    if (!result.success) {
        res
            .status(400)
            .json({
            message: "로그인 유효성 검사 실패",
            error: result.error.format(),
        });
        return;
    }
    next();
};
exports.validateLogin = validateLogin;
