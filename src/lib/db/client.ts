import { PrismaClient } from "@prisma/client";

// Prisma Client 싱글톤 패턴
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
    // Connection pool 최적화
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Connection pool 설정 (환경변수로 관리)
if (!process.env.DATABASE_URL?.includes("connection_limit")) {
  console.warn(
    "⚠️  DATABASE_URL에 connection_limit가 설정되지 않았습니다. 기본값(10)이 사용됩니다."
  );
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// 타입 export
export type Database = typeof prisma;
export type { User, Session, Account, Verification } from "@prisma/client";
