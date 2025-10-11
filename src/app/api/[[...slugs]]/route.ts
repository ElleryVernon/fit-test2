import { Elysia } from "elysia";
import { garminRoutes } from "@/server/routes/garmin";
import { demoRoutes } from "@/server/routes/demo";
import { subscribeRoutes } from "@/server/routes/subscribe";
import { webhookRoutes } from "@/server/routes/webhooks";
import { authRoutes } from "@/server/routes/auth";
import { paymentsRoutes } from "@/server/routes/payments";

/**
 * Elysia 메인 서버
 * Next.js App Router와 통합된 API 서버
 */
const app = new Elysia({ prefix: "/api" })
  // CORS 설정
  .onRequest(({ set }) => {
    set.headers["Access-Control-Allow-Origin"] = "*";
    set.headers["Access-Control-Allow-Methods"] =
      "GET, POST, PUT, DELETE, OPTIONS";
    set.headers["Access-Control-Allow-Headers"] = "Content-Type";
  })
  // 라우트 등록
  .use(authRoutes)
  .use(garminRoutes)
  .use(demoRoutes)
  .use(subscribeRoutes)
  .use(webhookRoutes)
  .use(paymentsRoutes)
  // 헬스 체크
  .get("/", () => ({
    status: "ok",
    message: "Fitculator API Server",
    version: "2.0.0",
  }))
  // 에러 핸들링
  .onError(({ code, error, set }) => {
    console.error("API Error:", code, error);

    if (code === "VALIDATION") {
      set.status = 400;
      return {
        error: "Validation failed",
        message: error.toString(),
      };
    }

    if (code === "NOT_FOUND") {
      set.status = 404;
      return {
        error: "Not found",
        message: "The requested resource was not found",
      };
    }

    set.status = 500;
    return {
      error: "Internal server error",
      message: error?.toString() || "An unexpected error occurred",
    };
  });

// Next.js Route Handlers로 export
export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const PATCH = app.handle;
export const OPTIONS = app.handle;
