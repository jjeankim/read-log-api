import { PrismaClient } from "@prisma/client";
import { env } from "./env";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  });

if (env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("DB connected successfully.");
  } catch (error) {
    console.error("DB connection failed: ", error);
    process.exit(1);
  }
};
