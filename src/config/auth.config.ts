/**
 * 인증 관련 설정
 */

export const authConfig = {
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7일
    updateAge: 60 * 60 * 24, // 1일
  },
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    enabled: !!(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET
    ),
  },
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
} as const;
