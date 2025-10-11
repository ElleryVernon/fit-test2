import { Elysia, t } from "elysia";

/**
 * Auth API 라우트 (OAuth 관련)
 * Better Auth 내장 핸들러는 제외하고 커스텀 OAuth 로직만 포함
 *
 * 참고: Garmin OAuth는 /api/garmin/oauth/* 경로 사용
 * (Better Auth catch-all route와 충돌 방지)
 */
export const authRoutes = new Elysia({ prefix: "/auth" })
  // Apple 로그인 콜백
  .post(
    "/callback/apple",
    async ({ body, set }) => {
      try {
        const { code } = body;

        if (!code) {
          set.status = 400;
          return { error: "Authorization code is required" };
        }

        // Apple OAuth 처리 로직
        // 현재는 기본적인 응답만 반환
        return {
          success: true,
          message: "Apple login callback received",
        };
      } catch (error) {
        console.error("Apple OAuth callback error:", error);
        set.status = 500;
        return { error: "Internal server error" };
      }
    },
    {
      body: t.Object({
        code: t.String(),
      }),
    }
  );
