import { Elysia, t } from "elysia";
import { garminOAuthService } from "@/core/services";

/**
 * Auth API 라우트 (OAuth 관련)
 * Better Auth 내장 핸들러는 제외하고 커스텀 OAuth 로직만 포함
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
  )
  // Garmin OAuth 시작
  .get(
    "/garmin/start",
    async ({ query, set }) => {
      try {
        const { user_id } = query;

        if (!user_id) {
          set.status = 400;
          return { error: "user_id is required" };
        }

        // OAuth 2.0 PKCE를 위한 state와 code challenge 생성
        const { state, codeChallenge } =
          await garminOAuthService.generateOAuthState(user_id);

        // Garmin OAuth 2.0 URL 생성
        const authUrl = garminOAuthService.buildGarminAuthUrl(
          state,
          codeChallenge
        );

        // 로그 기록
        console.log("Starting Garmin OAuth 2.0 PKCE for user:", user_id);

        // 리다이렉트 (Elysia에서는 set.redirect 사용)
        set.redirect = authUrl;
        set.status = 302;
        return;
      } catch (error) {
        console.error("Failed to start Garmin OAuth:", error);
        set.status = 500;
        return { error: "Failed to initialize authentication" };
      }
    },
    {
      query: t.Object({
        user_id: t.String(),
      }),
    }
  )
  // Garmin OAuth 콜백
  .get(
    "/garmin/callback",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async ({ query, set }: any) => {
      console.log("🔗 [Garmin OAuth] Callback received");

      try {
        const code = query.code;
        const state = query.state;
        const error = query.error;

        console.log("📝 [Garmin OAuth] Parameters:", {
          code: code ? "present" : "missing",
          state,
          error,
        });

        // 에러가 있거나 사용자가 거부한 경우
        if (error || !code) {
          const errorMessage =
            error || "User denied access or authorization code missing";
          console.error("❌ [Garmin OAuth] Error:", errorMessage);

          // 리다이렉트
          const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
          set.redirect = `${baseUrl}/garmin-test?error=${encodeURIComponent(
            errorMessage
          )}`;
          set.status = 302;
          return;
        }

        // State 검증
        if (!state) {
          console.error("❌ [Garmin OAuth] No state parameter received");
          const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
          set.redirect = `${baseUrl}/garmin-test?error=${encodeURIComponent(
            "Invalid state"
          )}`;
          set.status = 302;
          return;
        }

        console.log("🔍 [Garmin OAuth] Verifying state:", state);
        const stateData = await garminOAuthService.verifyOAuthState(state);
        if (!stateData) {
          console.error("❌ [Garmin OAuth] Invalid or expired state:", state);
          const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
          set.redirect = `${baseUrl}/garmin-test?error=${encodeURIComponent(
            "Invalid or expired state"
          )}`;
          set.status = 302;
          return;
        }

        const { userId, codeVerifier } = stateData;
        console.log("✅ [Garmin OAuth] State verified for user:", userId);

        // OAuth 2.0 토큰 교환
        console.log("🔄 [Garmin OAuth] Exchanging tokens for user:", userId);
        const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/garmin/callback`;
        console.log("🔗 [Garmin OAuth] Redirect URI:", redirectUri);

        const tokens = await garminOAuthService.exchangeCodeForTokens(
          code,
          codeVerifier,
          redirectUri
        );
        console.log("✅ [Garmin OAuth] Tokens received");

        // 연결 정보 저장
        console.log("💾 [Garmin OAuth] Saving connection for user:", userId);
        await garminOAuthService.saveGarminConnection(
          userId,
          tokens.access_token,
          tokens.refresh_token,
          tokens.expires_in
        );

        console.log("✅ [Garmin OAuth] Connection saved for user:", userId);

        // 성공 리다이렉트
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        set.redirect = `${baseUrl}/garmin-test?success=true&user_id=${userId}`;
        set.status = 302;
        return;
      } catch (error) {
        console.error("❌ [Garmin OAuth] Callback error:", error);
        console.error(
          "❌ [Garmin OAuth] Error stack:",
          error instanceof Error ? error.stack : "No stack trace"
        );

        // 에러 메시지 구성
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
          errorMessage = `${error.name}: ${error.message}`;
          if (error.message.includes("Failed to fetch")) {
            errorMessage += " (Network issue - check Garmin API connection)";
          } else if (error.message.includes("Token exchange failed")) {
            errorMessage += " (Check Garmin client credentials)";
          } else if (error.message.includes("Invalid state")) {
            errorMessage += " (OAuth state expired or invalid)";
          }
        }

        console.error(
          "❌ [Garmin OAuth] Redirecting with error:",
          errorMessage
        );
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        set.redirect = `${baseUrl}/garmin-test?error=${encodeURIComponent(
          errorMessage
        )}`;
        set.status = 302;
        return;
      }
    },
    {
      query: t.Object({
        code: t.Optional(t.String()),
        state: t.Optional(t.String()),
        error: t.Optional(t.String()),
      }),
    }
  );
