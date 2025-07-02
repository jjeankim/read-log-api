"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    const accessToken = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
    }, process.env.JWT_ACCESS_SECRET_KEY, {
        expiresIn: "7d",
    });
    const refreshToken = jsonwebtoken_1.default.sign({
        id: user.id,
    }, process.env.JWT_REFRESH_SECRET_KEY, {
        expiresIn: "7d",
    });
    return { accessToken, refreshToken };
};
exports.default = generateToken;
