"use strict";
// scripts/resetDatabase.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function resetDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 삭제 순서 중요: 관계가 있는 경우 자식 → 부모 순서로 삭제
            yield prisma.comment.deleteMany();
            yield prisma.log.deleteMany();
            yield prisma.user.deleteMany();
            console.log("✅ 모든 데이터가 초기화되었습니다.");
        }
        catch (err) {
            console.error("❌ 데이터 초기화 중 오류:", err);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
resetDatabase();
