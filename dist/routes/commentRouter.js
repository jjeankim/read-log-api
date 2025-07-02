"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const auth_1 = __importDefault(require("../middlewares/auth"));
const commentRouter = express_1.default.Router({ mergeParams: true });
commentRouter
    .route("/")
    .post(auth_1.default, commentController_1.createComment)
    .get(commentController_1.getComments);
commentRouter
    .route("/:commentId")
    .patch(auth_1.default, commentController_1.updateComment)
    .delete(auth_1.default, commentController_1.deleteComment);
exports.default = commentRouter;
