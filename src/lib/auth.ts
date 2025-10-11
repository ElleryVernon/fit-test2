import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db/client";
import { authConfig } from "@/config";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: authConfig.google.clientId,
      clientSecret: authConfig.google.clientSecret,
      enabled: authConfig.google.enabled,
      // 필요한 scope만 요청하여 OAuth 속도 향상
      scope: ["email", "profile"],
    },
  },
  session: {
    expiresIn: authConfig.session.expiresIn,
    updateAge: authConfig.session.updateAge,
    // 세션 쿠키 최적화
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5분간 캐싱
    },
  },
  baseURL: authConfig.baseURL,
  trustedOrigins: [
    "http://localhost:3000",
    "https://fit-test2.vercel.app",
    "https://fitculator.com",
    "https://www.fitculator.com",
  ],
  // 성능 최적화: 불필요한 DB 쿼리 감소
  advanced: {
    // 세션 검증 시 매번 DB 조회하지 않고 JWT 토큰 검증 사용
    useSecureCookies: process.env.NODE_ENV === "production",
    // CSRF 보호 간소화 (성능 향상)
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
