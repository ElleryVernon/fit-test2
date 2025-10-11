/**
 * Garmin Backfill 서비스
 *
 * Garmin Health API는 Webhook 전용입니다!
 * - 직접 Pull 방식으로 데이터 요청 불가
 * - Backfill API는 202 Accepted 반환 후 Webhook으로 데이터 전송
 * - 실제 데이터는 Webhook 핸들러에서 DB에 저장됨
 *
 * 공식 문서: Health API Section 8 - Summary Backfill
 */

import { prisma } from "@/lib/db/client";
import { garminConfig } from "@/config";

// 캐시 TTL (10분)
const CACHE_TTL_MS = 10 * 60 * 1000;

// Backfill 쿨다운 (중복 방지)
const BACKFILL_COOLDOWN_MS = 60 * 1000; // 1분

// Backfill 요청 상태 추적
const backfillStatus = new Map<
  string,
  { requested: boolean; lastRequest: number }
>();

export class GarminSyncService {
  /**
   * 데이터 신선도 확인
   */
  async isDataStale(userId: string): Promise<boolean> {
    try {
      const latestActivity = await prisma.garminActivity.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      });

      if (!latestActivity) {
        return true; // 데이터 없음 = stale
      }

      const ageMs = Date.now() - latestActivity.createdAt.getTime();
      return ageMs > CACHE_TTL_MS;
    } catch (error) {
      console.error("[GarminSync] isDataStale error:", error);
      return true;
    }
  }

  /**
   * Backfill 요청 (비동기)
   *
   * Backfill은 202 Accepted를 반환하고
   * 실제 데이터는 나중에 Webhook으로 전송됨
   *
   * 문서 참조: Section 8 - Summary Backfill
   */
  async requestBackfill(
    userId: string,
    accessToken: string,
    options: {
      startDate?: Date;
      endDate?: Date;
      summaryType?: "dailies" | "epochs" | "sleeps";
    } = {}
  ): Promise<{ requested: boolean; status: string; message: string }> {
    const syncKey = `backfill-${userId}-${options.summaryType || "dailies"}`;

    // 중복 요청 방지
    const current = backfillStatus.get(syncKey);
    if (current?.requested) {
      const timeSince = Date.now() - current.lastRequest;
      if (timeSince < BACKFILL_COOLDOWN_MS) {
        return {
          requested: false,
          status: "cooldown",
          message: `Please wait ${Math.ceil((BACKFILL_COOLDOWN_MS - timeSince) / 1000)}s before requesting again.`,
        };
      }
    }

    try {
      // 날짜 범위 (최대 90일)
      const endDate = options.endDate || new Date();
      const startDate =
        options.startDate ||
        new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);

      const summaryStartTime = Math.floor(startDate.getTime() / 1000);
      const summaryEndTime = Math.floor(endDate.getTime() / 1000);
      const summaryType = options.summaryType || "dailies";

      console.log(
        `[GarminBackfill] Requesting ${summaryType} for user ${userId}`
      );

      // Backfill API (문서 Section 8)
      const backfillUrl = `${garminConfig.api.baseUrl}/backfill/${summaryType}?summaryStartTimeInSeconds=${summaryStartTime}&summaryEndTimeInSeconds=${summaryEndTime}`;

      const response = await fetch(backfillUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal: AbortSignal.timeout(15000),
      });

      // 202 Accepted: 정상 (비동기 처리)
      if (response.status === 202) {
        backfillStatus.set(syncKey, {
          requested: true,
          lastRequest: Date.now(),
        });

        console.log(
          `[GarminBackfill] ✅ Request accepted. Data will arrive via webhook.`
        );

        return {
          requested: true,
          status: "accepted",
          message:
            "Backfill request accepted. Sync your Garmin device to receive the data.",
        };
      }

      // 409 Conflict: 중복 요청
      if (response.status === 409) {
        return {
          requested: false,
          status: "duplicate",
          message: "This time range was already requested.",
        };
      }

      // 401/403: 토큰 만료
      if (response.status === 401 || response.status === 403) {
        await prisma.garminConnection.updateMany({
          where: { userId },
          data: { needsReauth: true },
        });

        return {
          requested: false,
          status: "unauthorized",
          message: "Token expired. Please reconnect your Garmin account.",
        };
      }

      // 기타 에러
      const errorText = await response.text();
      console.error(
        `[GarminBackfill] Error ${response.status}: ${errorText}`
      );

      return {
        requested: false,
        status: "error",
        message: `Backfill failed: ${response.status}`,
      };
    } catch (error) {
      console.error(`[GarminBackfill] Request failed:`, error);
      return {
        requested: false,
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * 연결 상태 및 토큰 유효성 검증
   */
  async validateConnection(userId: string): Promise<{
    valid: boolean;
    connection?: {
      accessToken: string;
      garminUserId: string;
      needsReauth: boolean;
    };
  }> {
    try {
      const connection = await prisma.garminConnection.findFirst({
        where: { userId },
        select: {
          accessToken: true,
          garminUserId: true,
          needsReauth: true,
          tokenExpiresAt: true,
        },
      });

      if (!connection) {
        return { valid: false };
      }

      // 토큰 만료 체크
      const tokenExpired = connection.tokenExpiresAt
        ? new Date(connection.tokenExpiresAt) < new Date()
        : false;

      if (tokenExpired || connection.needsReauth) {
        return { valid: false };
      }

      return {
        valid: true,
        connection: {
          accessToken: connection.accessToken,
          garminUserId: connection.garminUserId,
          needsReauth: connection.needsReauth,
        },
      };
    } catch (error) {
      console.error(`[GarminSync] validateConnection error:`, error);
      return { valid: false };
    }
  }
}

// Singleton 인스턴스 export
export const garminSyncService = new GarminSyncService();
