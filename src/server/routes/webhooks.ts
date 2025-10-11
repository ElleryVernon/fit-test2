import { Elysia, t } from "elysia";
import { prisma } from "@/lib/db/client";
import { garminWebhookService } from "@/core/services";
import { WEBHOOK_TYPES } from "@/constants";

/**
 * 공통 웹훅 핸들러 생성 함수
 */
const createWebhookHandler = (webhookType: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async ({ body, set }: any) => {
    const startTime = Date.now();
    console.log(
      `🔔 [${webhookType}] Webhook received at ${new Date().toISOString()}`
    );

    try {
      // 페이로드 로깅
      console.log(
        `📦 [${webhookType}] Payload:`,
        JSON.stringify(body, null, 2)
      );

      // 1. 기본 payload 검증
      if (
        !garminWebhookService.verifyWebhookPayload(
          body as Record<string, unknown>
        )
      ) {
        console.error(`❌ [${webhookType}] Invalid webhook payload structure`);
        set.status = 200; // 재시도 방지를 위해 200 반환
        set.headers["Access-Control-Allow-Origin"] = "*";
        return {
          status: "ok",
          error_logged: true,
          message: "Invalid payload structure",
          processed_at: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime,
        };
      }
      console.log(`✅ [${webhookType}] Payload validation passed`);

      // 2. Webhook 로그 저장
      console.log(`💾 [${webhookType}] Saving webhook log...`);
      const webhook = await garminWebhookService.saveWebhookLog(
        webhookType,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        body as any
      );
      console.log(
        `✅ [${webhookType}] Webhook log saved with ID: ${webhook.id}`
      );

      // 3. 비동기 처리 (즉시 200 응답 반환)
      console.log(`⚡ [${webhookType}] Starting async processing for webhook ${webhook.id}...`);
      garminWebhookService.processWebhook(webhook.id).catch((error) => {
        console.error(
          `❌❌❌ [${webhookType}] WEBHOOK PROCESSING FAILED for ${webhook.id}:`,
          error instanceof Error ? error.message : error
        );
        if (error instanceof Error && error.stack) {
          console.error(`💥💥💥 [${webhookType}] Stack trace:`, error.stack);
        }
        console.error(`🔍 [${webhookType}] Full error object:`, JSON.stringify(error, Object.getOwnPropertyNames(error)));
      });

      // 4. Garmin에 성공 응답
      const processingTime = Date.now() - startTime;
      console.log(
        `🎉 [${webhookType}] Webhook processed successfully in ${processingTime}ms`
      );

      // CORS 헤더 설정
      set.headers["Access-Control-Allow-Origin"] = "*";
      set.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
      set.headers["Access-Control-Allow-Headers"] =
        "Content-Type, Authorization";
      set.status = 200;

      return {
        status: "ok",
        processed_at: new Date().toISOString(),
        processing_time_ms: processingTime,
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(
        `💥 [${webhookType}] Webhook error in ${processingTime}ms:`,
        error
      );

      // 스택 트레이스 로깅
      if (error instanceof Error) {
        console.error(`💥 [${webhookType}] Error message:`, error.message);
        if (error.stack) {
          console.error(`💥 [${webhookType}] Stack trace:`, error.stack);
        }
      }

      // 에러가 발생해도 200 반환 (Garmin 재시도 방지)
      set.status = 200;
      set.headers["Access-Control-Allow-Origin"] = "*";

      return {
        status: "ok",
        error_logged: true,
        message: error instanceof Error ? error.message : "Unknown error",
        processed_at: new Date().toISOString(),
        processing_time_ms: processingTime,
      };
    }
  };
};

/**
 * Garmin Webhook API 라우트
 * 프로덕션급 웹훅 처리 로직
 */
export const webhookRoutes = new Elysia({ prefix: "/webhook/garmin" })
  // 공통 웹훅 핸들러 - 7개 엔드포인트
  .post("/activities", createWebhookHandler(WEBHOOK_TYPES.ACTIVITIES), {
    body: t.Any(),
  })
  .post(
    "/activity-details",
    createWebhookHandler(WEBHOOK_TYPES.ACTIVITY_DETAILS),
    {
      body: t.Any(),
    }
  )
  .post("/activity-files", createWebhookHandler(WEBHOOK_TYPES.ACTIVITY_FILES), {
    body: t.Any(),
  })
  .post(
    "/manual-activities",
    createWebhookHandler(WEBHOOK_TYPES.MANUAL_ACTIVITIES),
    {
      body: t.Any(),
    }
  )
  .post("/moveiq", createWebhookHandler(WEBHOOK_TYPES.MOVEIQ), {
    body: t.Any(),
  })
  .post(
    "/deregistrations",
    createWebhookHandler(WEBHOOK_TYPES.DEREGISTRATIONS),
    {
      body: t.Any(),
    }
  )
  .post("/permissions", createWebhookHandler(WEBHOOK_TYPES.PERMISSIONS), {
    body: t.Any(),
  })
  // GET /webhook/garmin/status - 웹훅 통계 조회
  .get("/status", async ({ set }) => {
    try {
      // 최근 24시간 통계
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const stats = await prisma.webhookLog.findMany({
        where: { createdAt: { gte: yesterday } },
        select: { status: true, type: true },
      });

      // 상태별 집계
      type Summary = {
        pending: number;
        processing: number;
        success: number;
        failed: number;
        types: Record<string, number>;
      };

      const summary = stats.reduce<Summary>(
        (acc, log) => {
          const status = log.status as
            | "pending"
            | "processing"
            | "success"
            | "failed"
            | null;
          if (status) {
            acc[status] = (acc[status] || 0) + 1;
          }
          acc.types[log.type] = (acc.types[log.type] || 0) + 1;
          return acc;
        },
        { pending: 0, processing: 0, success: 0, failed: 0, types: {} }
      );

      // 최근 로그 10개
      const recent = await prisma.webhookLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      return {
        status: "healthy",
        last_24h: summary,
        recent_logs: recent,
      };
    } catch (error) {
      console.error("Status endpoint error:", error);
      set.status = 500;
      return { error: "Failed to fetch status" };
    }
  })
  // POST /webhook/garmin/retry - 실패한 웹훅 재처리 (관리자 전용)
  .post("/retry", async ({ headers, set }) => {
    try {
      // 관리자 인증 체크
      const authHeader = headers.authorization;
      const adminSecret = process.env.ADMIN_SECRET;

      if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      // 실패한 webhook 재처리 (최대 3회 재시도 제한)
      const failedWebhooks = await prisma.webhookLog.findMany({
        where: {
          status: "failed",
          retryCount: { lt: 3 },
        },
        select: { id: true },
        take: 10,
      });

      console.log(
        `🔄 [RETRY] Processing ${failedWebhooks.length} failed webhooks`
      );

      const results = await Promise.allSettled(
        failedWebhooks.map((w) => garminWebhookService.processWebhook(w.id))
      );

      const successCount = results.filter(
        (r) => r.status === "fulfilled"
      ).length;
      const failedCount = results.length - successCount;

      console.log(
        `✅ [RETRY] Completed: ${successCount} success, ${failedCount} failed`
      );

      return {
        retried: results.length,
        success: successCount,
        failed: failedCount,
      };
    } catch (error) {
      console.error("Retry endpoint error:", error);
      set.status = 500;
      return { error: "Retry failed" };
    }
  });
