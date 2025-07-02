"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadSingle = exports.uploadPath = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const rootPath = path_1.default.resolve(__dirname, "../../");
exports.uploadPath = path_1.default.join(rootPath, "public", "uploads");
if (!fs_1.default.existsSync(exports.uploadPath))
    fs_1.default.mkdirSync(exports.uploadPath, { recursive: true });
app.use("/uploads", express_1.default.static(exports.uploadPath));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, exports.uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.trunc(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
exports.uploadSingle = upload.single("profile");
exports.uploadMultiple = upload.array("images", 5);
