"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logController_1 = require("../controllers/logController");
const auth_1 = __importDefault(require("../middlewares/auth"));
const upload_1 = require("../middlewares/upload");
const logRouter = express_1.default.Router();
logRouter.route("/").post(auth_1.default, upload_1.uploadMultiple, logController_1.createLog).get(logController_1.getLogs);
logRouter
    .route("/:logId")
    .get(logController_1.getLog)
    .put(auth_1.default, upload_1.uploadMultiple, logController_1.updateLog)
    .delete(auth_1.default, logController_1.deleteLog);
logRouter.get("/my-logs", auth_1.default, logController_1.getMyLogs);
exports.default = logRouter;
