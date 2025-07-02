"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        res.status(404).json({ message: "Unauthorized" });
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(404).json({ message: "Unauthorized" });
            return;
        }
        req.user = decoded;
        next();
    });
};
exports.default = authenticate;
