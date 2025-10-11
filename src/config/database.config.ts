/**
 * 데이터베이스 관련 설정
 */

export const databaseConfig = {
  url: process.env.DATABASE_URL || "",
  provider: "postgresql" as const,
  pool: {
    min: 2,
    max: 10,
  },
} as const;
