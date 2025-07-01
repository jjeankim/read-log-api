// scripts/resetDatabase.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    // 삭제 순서 중요: 관계가 있는 경우 자식 → 부모 순서로 삭제
    await prisma.comment.deleteMany();
    await prisma.log.deleteMany();
    await prisma.user.deleteMany();

    console.log("✅ 모든 데이터가 초기화되었습니다.");
  } catch (err) {
    console.error("❌ 데이터 초기화 중 오류:", err);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
