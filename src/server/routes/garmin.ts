import { Elysia, t } from "elysia";
import { prisma } from "@/lib/db/client";
import { garminOAuthService, garminSyncService } from "@/core/services";

// 통계 계산용 타입
type Activity = {
  startTime: Date;
  activityType: string;
  durationSeconds: number | null;
  distanceMeters: number | null;
  calories: number | null;
  steps: number | null;
  avgHeartRate: number | null;
};

// 통계 계산 함수
function calculateStatistics(activities: Activity[]) {
  const summary = {
    total_activities: activities.length,
    total_duration_hours: 0,
    total_distance_km: 0,
    total_calories: 0,
    avg_heart_rate: 0,
    total_steps: 0,
  };

  const dailyStats: Record<
    string,
    {
      date: string;
      activities: number;
      duration_minutes: number;
      distance_km: number;
      calories: number;
      steps: number;
    }
  > = {};

  activities.forEach((activity) => {
    // 전체 통계
    summary.total_duration_hours += (activity.durationSeconds || 0) / 3600;
    summary.total_distance_km += (activity.distanceMeters || 0) / 1000;
    summary.total_calories += activity.calories || 0;
    summary.total_steps += activity.steps || 0;

    // 일별 통계
    const date = new Date(activity.startTime).toISOString().split("T")[0];
    if (!dailyStats[date]) {
      dailyStats[date] = {
        date,
        activities: 0,
        duration_minutes: 0,
        distance_km: 0,
        calories: 0,
        steps: 0,
      };
    }

    dailyStats[date].activities++;
    dailyStats[date].duration_minutes += (activity.durationSeconds || 0) / 60;
    dailyStats[date].distance_km += (activity.distanceMeters || 0) / 1000;
    dailyStats[date].calories += activity.calories || 0;
    dailyStats[date].steps += activity.steps || 0;
  });

  // 평균 심박수 계산
  const heartRates = activities
    .filter((a) => a.avgHeartRate)
    .map((a) => a.avgHeartRate!);

  summary.avg_heart_rate =
    heartRates.length > 0
      ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length)
      : 0;

  // 소수점 정리
  summary.total_duration_hours = parseFloat(
    summary.total_duration_hours.toFixed(2)
  );
  summary.total_distance_km = parseFloat(summary.total_distance_km.toFixed(2));

  // 일별 통계 소수점 정리
  Object.values(dailyStats).forEach((stat) => {
    stat.duration_minutes = Math.round(stat.duration_minutes);
    stat.distance_km = parseFloat(stat.distance_km.toFixed(2));
  });

  return {
    summary,
    daily: Object.values(dailyStats).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
  };
}

// 트렌드 분석
function calculateTrends(activities: Activity[]) {
  if (activities.length < 2) {
    return {
      activity_frequency: "stable",
      intensity_trend: "stable",
      message: "Not enough data for trend analysis",
    };
  }

  // 최근 7일 vs 이전 7일 비교
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const recentActivities = activities.filter(
    (a) => new Date(a.startTime) >= oneWeekAgo
  );
  const previousActivities = activities.filter((a) => {
    const date = new Date(a.startTime);
    return date >= twoWeeksAgo && date < oneWeekAgo;
  });

  const frequencyTrend =
    recentActivities.length > previousActivities.length
      ? "increasing"
      : recentActivities.length < previousActivities.length
      ? "decreasing"
      : "stable";

  const recentAvgDuration =
    recentActivities.reduce((sum, a) => sum + (a.durationSeconds || 0), 0) /
    (recentActivities.length || 1);
  const prevAvgDuration =
    previousActivities.reduce((sum, a) => sum + (a.durationSeconds || 0), 0) /
    (previousActivities.length || 1);

  const intensityTrend =
    recentAvgDuration > prevAvgDuration
      ? "increasing"
      : recentAvgDuration < prevAvgDuration
      ? "decreasing"
      : "stable";

  return {
    activity_frequency: frequencyTrend,
    intensity_trend: intensityTrend,
    recent_count: recentActivities.length,
    previous_count: previousActivities.length,
    avg_duration_change: Math.round((recentAvgDuration - prevAvgDuration) / 60),
  };
}

/**
 * Garmin API 라우트
 */
export const garminRoutes = new Elysia({ prefix: "/garmin" })
  // GET /api/garmin/oauth/start - Garmin OAuth 시작
  .get(
    "/oauth/start",
    async ({ query }) => {
      try {
        const { user_id } = query;

        if (!user_id) {
          return new Response(
            JSON.stringify({ error: "user_id is required" }),
            { status: 400 }
          );
        }

        // OAuth 2.0 PKCE를 위한 state와 code challenge 생성
        const { state, codeChallenge } =
          await garminOAuthService.generateOAuthState(user_id);

        // Garmin OAuth 2.0 URL 생성
        const authUrl = garminOAuthService.buildGarminAuthUrl(
          state,
          codeChallenge
        );

        console.log("Starting Garmin OAuth 2.0 PKCE for user:", user_id);
        console.log("Redirect URL:", authUrl);

        // 302 리다이렉트
        return new Response(null, {
          status: 302,
          headers: {
            Location: authUrl,
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
      } catch (error) {
        console.error("Failed to start Garmin OAuth:", error);
        return new Response(
          JSON.stringify({ error: "Failed to initialize authentication" }),
          { status: 500 }
        );
      }
    },
    {
      query: t.Object({
        user_id: t.String(),
      }),
    }
  )
  // GET /api/garmin/oauth/callback - Garmin OAuth 콜백
  .get(
    "/oauth/callback",
    async ({ query }) => {
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

        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        // 에러가 있거나 사용자가 거부한 경우
        if (error || !code) {
          const errorMessage =
            error || "User denied access or authorization code missing";
          console.error("❌ [Garmin OAuth] Error:", errorMessage);

          return new Response(null, {
            status: 302,
            headers: {
              Location: `${baseUrl}/garmin-test?error=${encodeURIComponent(
                errorMessage
              )}`,
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          });
        }

        // State 검증
        if (!state) {
          console.error("❌ [Garmin OAuth] No state parameter received");
          return new Response(null, {
            status: 302,
            headers: {
              Location: `${baseUrl}/garmin-test?error=${encodeURIComponent(
                "Invalid state"
              )}`,
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          });
        }

        console.log("🔍 [Garmin OAuth] Verifying state:", state);
        const stateData = await garminOAuthService.verifyOAuthState(state);
        if (!stateData) {
          console.error("❌ [Garmin OAuth] Invalid or expired state:", state);
          return new Response(null, {
            status: 302,
            headers: {
              Location: `${baseUrl}/garmin-test?error=${encodeURIComponent(
                "Invalid or expired state"
              )}`,
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          });
        }

        const { userId, codeVerifier } = stateData;
        console.log("✅ [Garmin OAuth] State verified for user:", userId);

        // OAuth 2.0 토큰 교환
        console.log("🔄 [Garmin OAuth] Exchanging tokens for user:", userId);
        const redirectUri = `${baseUrl}/api/garmin/oauth/callback`;
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
        return new Response(null, {
          status: 302,
          headers: {
            Location: `${baseUrl}/garmin-test?success=true&user_id=${userId}`,
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
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

        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        return new Response(null, {
          status: 302,
          headers: {
            Location: `${baseUrl}/garmin-test?error=${encodeURIComponent(
              errorMessage
            )}`,
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
      }
    },
    {
      query: t.Object({
        code: t.Optional(t.String()),
        state: t.Optional(t.String()),
        error: t.Optional(t.String()),
      }),
    }
  )
  // GET /api/garmin/connection-status
  .get(
    "/connection-status",
    async ({ query, set }) => {
      try {
        const { user_id } = query;

        if (!user_id) {
          set.status = 400;
          return { error: "user_id is required" };
        }

        // 연결 정보와 최근 활동 수를 병렬로 조회
        const [connection, activityCount, latestActivity] = await Promise.all([
          prisma.garminConnection.findFirst({
            where: { userId: user_id },
            select: {
              garminUserId: true,
              needsReauth: true,
              scopes: true,
              createdAt: true,
              updatedAt: true,
              tokenExpiresAt: true,
            },
          }),
          prisma.garminActivity.count({
            where: { userId: user_id },
          }),
          prisma.garminActivity.findFirst({
            where: { userId: user_id },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true, startTime: true },
          }),
        ]);

        if (!connection) {
          return {
            connected: false,
            message: "No Garmin connection found",
          };
        }

        // 토큰 만료 체크
        const tokenExpired = connection.tokenExpiresAt
          ? new Date(connection.tokenExpiresAt) < new Date()
          : false;

        // 캐싱 헤더
        set.headers["Cache-Control"] =
          "public, s-maxage=30, stale-while-revalidate=60";

        return {
          connected: true,
          garmin_user_id: connection.garminUserId,
          needs_reauth: connection.needsReauth || tokenExpired,
          scopes: connection.scopes,
          connected_at: connection.createdAt,
          last_updated: connection.updatedAt,
          total_activities: activityCount,
          latest_activity: latestActivity
            ? {
                received_at: latestActivity.createdAt,
                activity_date: latestActivity.startTime,
              }
            : null,
        };
      } catch (error) {
        console.error("Connection status error:", error);
        set.status = 500;
        return { error: "Failed to check connection status" };
      }
    },
    {
      query: t.Object({
        user_id: t.String(),
      }),
    }
  )
  // GET /api/garmin/activities
  .get(
    "/activities",
    async ({ query, set }) => {
      try {
        const {
          user_id,
          limit = "20",
          offset = "0",
          start_date,
          end_date,
          activity_type,
        } = query;

        if (!user_id) {
          set.status = 400;
          return { error: "user_id is required" };
        }

        const limitNum = parseInt(limit);
        const offsetNum = parseInt(offset);

        // 쿼리 조건 빌드 (DB에서만 조회)
        const whereConditions: Record<string, unknown> = {
          userId: user_id,
        };

        // 날짜 필터
        if (start_date || end_date) {
          whereConditions.startTime = {};
          if (start_date) {
            (whereConditions.startTime as Record<string, unknown>).gte =
              new Date(start_date);
          }
          if (end_date) {
            (whereConditions.startTime as Record<string, unknown>).lte =
              new Date(end_date);
          }
        }

        // 활동 타입 필터
        if (activity_type) {
          whereConditions.activityType = activity_type;
        }

        // 필요한 필드만 선택하여 조회 (성능 개선)
        const activities = await prisma.garminActivity.findMany({
          where: whereConditions,
          select: {
            id: true,
            garminActivityId: true,
            activityName: true,
            activityType: true,
            startTime: true,
            durationSeconds: true,
            distanceMeters: true,
            calories: true,
            avgHeartRate: true,
            maxHeartRate: true,
            minHeartRate: true,
            steps: true,
            isManual: true,
            isAutoDetected: true,
          },
          orderBy: { startTime: "desc" },
          take: limitNum,
          skip: offsetNum,
        });

        // 응답 데이터 정리
        const formattedActivities = activities.map((activity) => ({
          id: activity.id,
          activity_id: activity.garminActivityId,
          name: activity.activityName,
          type: activity.activityType,
          start_time: activity.startTime,
          duration_minutes: activity.durationSeconds
            ? Math.round(activity.durationSeconds / 60)
            : null,
          distance_km: activity.distanceMeters
            ? (activity.distanceMeters / 1000).toFixed(2)
            : null,
          calories: activity.calories,
          heart_rate: {
            avg: activity.avgHeartRate,
            max: activity.maxHeartRate,
            min: activity.minHeartRate,
          },
          steps: activity.steps,
          is_manual: activity.isManual,
          is_auto_detected: activity.isAutoDetected,
        }));

        // 데이터가 없으면 Webhook 대기 안내
        if (activities.length === 0) {
          // 디버깅 정보 추가
          const connection = await prisma.garminConnection.findFirst({
            where: { userId: user_id },
            select: { garminUserId: true, createdAt: true },
          });

          return {
            activities: [],
            pagination: {
              total: 0,
              limit: limitNum,
              offset: offsetNum,
              has_more: false,
            },
            message:
              "No activity data yet. Request backfill to get historical data.",
            webhook_info: {
              status: "waiting",
              note: "Garmin Health API uses webhooks. Data will be pushed automatically when you sync your device.",
            },
            debug: {
              user_id: user_id,
              garmin_user_id: connection?.garminUserId || "not_connected",
              connected_at: connection?.createdAt,
              next_steps: [
                "1. Request backfill: POST /api/garmin/backfill",
                "2. Sync your Garmin device with Garmin Connect app",
                "3. Wait for webhook to deliver data (usually < 5 minutes)",
              ],
            },
          };
        }

        // 캐싱 헤더 추가
        set.headers["Cache-Control"] =
          "public, s-maxage=60, stale-while-revalidate=120";

        return {
          activities: formattedActivities,
          pagination: {
            total: activities.length,
            limit: limitNum,
            offset: offsetNum,
            has_more: activities.length === limitNum,
          },
          webhook_info: {
            status: "received",
            last_update: activities[0]?.startTime,
            total_activities: formattedActivities.length,
          },
        };
      } catch (error) {
        console.error("Activities fetch error:", error);
        set.status = 500;
        return { error: "Failed to fetch activities" };
      }
    },
    {
      query: t.Object({
        user_id: t.String(),
        limit: t.Optional(t.String()),
        offset: t.Optional(t.String()),
        start_date: t.Optional(t.String()),
        end_date: t.Optional(t.String()),
        activity_type: t.Optional(t.String()),
      }),
    }
  )
  // GET /api/garmin/user-id
  .get(
    "/user-id",
    async ({ query, set }) => {
      try {
        const { user_id } = query;

        if (!user_id) {
          set.status = 400;
          return { error: "user_id is required" };
        }

        // 연결 정보 조회
        const connection = await prisma.garminConnection.findFirst({
          where: { userId: user_id },
          select: {
            accessToken: true,
            garminUserId: true,
          },
        });

        if (!connection) {
          set.status = 404;
          return { error: "No Garmin connection found" };
        }

        // 이미 저장된 Garmin User ID가 있으면 반환
        if (connection.garminUserId) {
          return {
            garmin_user_id: connection.garminUserId,
          };
        }

        // 없으면 Garmin API에서 조회
        try {
          const garminUserId = await garminOAuthService.fetchGarminUserId(
            connection.accessToken
          );

          // DB에 저장
          await prisma.garminConnection.updateMany({
            where: { userId: user_id },
            data: { garminUserId },
          });

          return {
            garmin_user_id: garminUserId,
          };
        } catch (apiError) {
          console.error("Failed to fetch Garmin user ID:", apiError);
          set.status = 500;
          return { error: "Failed to fetch Garmin user ID" };
        }
      } catch (error) {
        console.error("User ID endpoint error:", error);
        set.status = 500;
        return { error: "Internal server error" };
      }
    },
    {
      query: t.Object({
        user_id: t.String(),
      }),
    }
  )
  // GET /api/garmin/permissions
  .get(
    "/permissions",
    async ({ query, set }) => {
      try {
        const { user_id } = query;

        if (!user_id) {
          set.status = 400;
          return { error: "user_id is required" };
        }

        // 연결 정보 조회
        const connection = await prisma.garminConnection.findFirst({
          where: { userId: user_id },
          select: {
            accessToken: true,
            scopes: true,
          },
        });

        if (!connection) {
          set.status = 404;
          return { error: "No Garmin connection found" };
        }

        // 이미 저장된 권한이 있으면 반환
        if (connection.scopes && connection.scopes.length > 0) {
          return {
            permissions: connection.scopes,
            source: "cached",
          };
        }

        // 없으면 Garmin API에서 실시간 조회
        try {
          const permissions = await garminOAuthService.fetchGarminPermissions(
            connection.accessToken
          );

          // DB에 저장
          await prisma.garminConnection.updateMany({
            where: { userId: user_id },
            data: { scopes: permissions },
          });

          return {
            permissions: permissions,
            source: "live",
          };
        } catch (apiError) {
          console.error("Failed to fetch Garmin permissions:", apiError);
          set.status = 500;
          return { error: "Failed to fetch permissions" };
        }
      } catch (error) {
        console.error("Permissions endpoint error:", error);
        set.status = 500;
        return { error: "Internal server error" };
      }
    },
    {
      query: t.Object({
        user_id: t.String(),
      }),
    }
  )
  // POST /api/garmin/disconnect
  .post(
    "/disconnect",
    async ({ body, set }) => {
      try {
        const { user_id, keep_data = false } = body;

        if (!user_id) {
          set.status = 400;
          return { error: "user_id is required" };
        }

        // 1. 연결 정보 조회
        const connection = await prisma.garminConnection.findFirst({
          where: { userId: user_id },
        });

        if (!connection) {
          set.status = 404;
          return { error: "No Garmin connection found" };
        }

        // 3. 연결 정보 삭제
        await prisma.garminConnection.delete({
          where: { id: connection.id },
        });

        // 4. 활동 데이터 처리 (선택적)
        if (!keep_data) {
          await prisma.garminActivity.deleteMany({
            where: { userId: user_id },
          });
        }

        // 5. 관련 webhook 로그 정리 (선택적)
        await prisma.webhookLog.deleteMany({
          where: {
            garminUserId: connection.garminUserId,
            status: { in: ["pending", "processing"] },
          },
        });

        console.log(`Garmin disconnected for user: ${user_id}`);

        return {
          success: true,
          message: "Garmin connection removed successfully",
          data_kept: keep_data,
        };
      } catch (error) {
        console.error("Disconnect error:", error);
        set.status = 500;
        return { error: "Failed to disconnect Garmin" };
      }
    },
    {
      body: t.Object({
        user_id: t.String(),
        keep_data: t.Optional(t.Boolean()),
      }),
    }
  )
  // PUT /api/garmin/disconnect (soft disconnect)
  .put(
    "/disconnect",
    async ({ body, set }) => {
      try {
        const { user_id } = body;

        if (!user_id) {
          set.status = 400;
          return { error: "user_id is required" };
        }

        const connection = await prisma.garminConnection.findFirst({
          where: { userId: user_id },
        });

        if (!connection) {
          set.status = 404;
          return { error: "No Garmin connection found" };
        }

        const updatedConnection = await prisma.garminConnection.update({
          where: { id: connection.id },
          data: { needsReauth: true },
        });

        return {
          success: true,
          message: "Connection marked for re-authentication",
          connection: updatedConnection,
        };
      } catch (error) {
        console.error("Soft disconnect error:", error);
        set.status = 500;
        return { error: "Failed to update connection" };
      }
    },
    {
      body: t.Object({
        user_id: t.String(),
      }),
    }
  )
  // GET /api/garmin/stats
  .get(
    "/stats",
    async ({ query, set }) => {
      try {
        const { user_id, period = "7" } = query;

        if (!user_id) {
          set.status = 400;
          return { error: "user_id is required" };
        }

        const days = parseInt(period);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // 기간 내 활동 조회
        const activities = await prisma.garminActivity.findMany({
          where: {
            userId: user_id,
            startTime: { gte: startDate },
          },
          select: {
            startTime: true,
            activityType: true,
            durationSeconds: true,
            distanceMeters: true,
            calories: true,
            steps: true,
            avgHeartRate: true,
          },
          orderBy: { startTime: "desc" },
        });

        // 통계 계산
        const stats = calculateStatistics(activities);

        // 활동 타입별 통계
        const activityTypeStats = activities.reduce(
          (
            acc: Record<
              string,
              {
                count: number;
                total_duration_minutes: number;
                total_distance_km: number;
                total_calories: number;
                avg_heart_rate: number[];
              }
            >,
            activity
          ) => {
            const type = activity.activityType;
            if (!acc[type]) {
              acc[type] = {
                count: 0,
                total_duration_minutes: 0,
                total_distance_km: 0,
                total_calories: 0,
                avg_heart_rate: [],
              };
            }

            acc[type].count++;
            acc[type].total_duration_minutes +=
              (activity.durationSeconds || 0) / 60;
            acc[type].total_distance_km +=
              (activity.distanceMeters || 0) / 1000;
            acc[type].total_calories += activity.calories || 0;

            if (activity.avgHeartRate) {
              acc[type].avg_heart_rate.push(activity.avgHeartRate);
            }

            return acc;
          },
          {}
        );

        // 평균 심박수 계산
        Object.keys(activityTypeStats).forEach((type) => {
          const heartRates = activityTypeStats[type].avg_heart_rate;
          activityTypeStats[type].avg_heart_rate =
            heartRates.length > 0
              ? [
                  Math.round(
                    heartRates.reduce((a, b) => a + b, 0) / heartRates.length
                  ),
                ]
              : [];

          // 소수점 정리
          activityTypeStats[type].total_duration_minutes = Math.round(
            activityTypeStats[type].total_duration_minutes
          );
          activityTypeStats[type].total_distance_km = parseFloat(
            activityTypeStats[type].total_distance_km.toFixed(2)
          );
        });

        // 주간 목표 달성률
        const weeklyGoal = 5;
        const currentWeekActivities = activities.filter((a) => {
          const activityDate = new Date(a.startTime);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return activityDate >= weekAgo;
        }).length;

        const goalProgress = Math.min(
          (currentWeekActivities / weeklyGoal) * 100,
          100
        );

        // 캐싱 헤더 추가
        set.headers["Cache-Control"] =
          "public, s-maxage=60, stale-while-revalidate=120";

        return {
          period: {
            days,
            start_date: startDate.toISOString(),
            end_date: new Date().toISOString(),
          },
          summary: stats.summary,
          daily_stats: stats.daily,
          activity_types: activityTypeStats,
          trends: calculateTrends(activities),
          goals: {
            weekly_activity_goal: weeklyGoal,
            current_week_activities: currentWeekActivities,
            goal_progress_percentage: Math.round(goalProgress),
          },
        };
      } catch (error) {
        console.error("Stats error:", error);
        set.status = 500;
        return { error: "Failed to fetch statistics" };
      }
    },
    {
      query: t.Object({
        user_id: t.String(),
        period: t.Optional(t.String()),
      }),
    }
  )
  // POST /api/garmin/backfill - Backfill 요청 (비동기)
  .post(
    "/backfill",
    async ({ body, set }) => {
      try {
        const { user_id, summary_type = "dailies", days = 90 } = body;

        if (!user_id) {
          set.status = 400;
          return { error: "user_id is required" };
        }

        // 연결 검증
        const validation = await garminSyncService.validateConnection(user_id);
        if (!validation.valid || !validation.connection) {
          set.status = 404;
          return {
            error: "No valid Garmin connection found",
            needs_reauth: true,
          };
        }

        console.log(
          `[API] Backfill requested for user ${user_id} (type: ${summary_type}, days: ${days})`
        );

        // Backfill 요청
        const result = await garminSyncService.requestBackfill(
          user_id,
          validation.connection.accessToken,
          {
            summaryType: summary_type as "dailies" | "epochs" | "sleeps",
            startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
          }
        );

        if (result.status === "accepted") {
          return {
            success: true,
            message:
              "Backfill request accepted. Please sync your Garmin device to receive the data via webhook.",
            status: result.status,
            webhook_note:
              "Data will appear automatically after you sync your Garmin device.",
          };
        }

        return {
          success: result.requested,
          message: result.message,
          status: result.status,
        };
      } catch (error) {
        console.error("[API] Backfill error:", error);
        set.status = 500;
        return { error: "Failed to request backfill" };
      }
    },
    {
      body: t.Object({
        user_id: t.String(),
        summary_type: t.Optional(t.String()),
        days: t.Optional(t.Number()),
      }),
    }
  );
