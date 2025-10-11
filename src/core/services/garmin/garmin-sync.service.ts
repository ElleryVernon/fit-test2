/**
 * Garmin 데이터 동기화 서비스
 *
 * 10분 TTL 기반 캐시 전략:
 * - 데이터가 10분 이내면 DB에서 조회
 * - 10분 이상 경과 시 가민 API에서 갱신 후 DB 저장
 * - 백그라운드 동기화로 성능 최적화
 */

import { prisma } from "@/lib/db/client";
import { garminConfig } from "@/config";
import type { Prisma } from "@prisma/client";

// 캐시 TTL (10분)
const CACHE_TTL_MS = 10 * 60 * 1000;

// 재시도 설정
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// 동기화 상태 추적 (메모리 캐시)
const syncStatus = new Map<
  string,
  { inProgress: boolean; lastAttempt: number }
>();

// Garmin Daily Summary 타입 (Health API 문서 Section 7.1 참조)
interface GarminDailySummary {
  summaryId: string;
  calendarDate: string;
  startTimeInSeconds: number;
  startTimeOffsetInSeconds: number;
  activityType: string;
  durationInSeconds: number;
  activeTimeInSeconds: number;
  steps: number;
  distanceInMeters: number;
  activeKilocalories: number;
  bmrKilocalories?: number;
  moderateIntensityDurationInSeconds?: number;
  vigorousIntensityDurationInSeconds?: number;
  floorsClimbed?: number;
  minHeartRateInBeatsPerMinute?: number;
  averageHeartRateInBeatsPerMinute?: number;
  maxHeartRateInBeatsPerMinute?: number;
  restingHeartRateInBeatsPerMinute?: number;
  timeOffsetHeartRateSamples?: Record<string, number>;
  averageStressLevel?: number;
  maxStressLevel?: number;
  stressDurationInSeconds?: number;
  restStressDurationInSeconds?: number;
  [key: string]: unknown;
}

interface GarminActivity {
  summaryId: string;
  activityName?: string;
  activityType: string;
  startTimeInSeconds: number;
  durationInSeconds?: number;
  distanceInMeters?: number;
  activeKilocalories?: number;
  averageHeartRateInBeatsPerMinute?: number;
  maxHeartRateInBeatsPerMinute?: number;
  minHeartRateInBeatsPerMinute?: number;
  steps?: number;
  moderateIntensityDurationInSeconds?: number;
  vigorousIntensityDurationInSeconds?: number;
  floorsClimbed?: number;
  isManual?: boolean;
  calendarDate?: string;
  [key: string]: unknown;
}

export class GarminSyncService {
  /**
   * Garmin API 호출 (재시도 로직 포함)
   */
  private async garminFetchWithRetry(
    endpoint: string,
    accessToken: string,
    retries = MAX_RETRIES
  ): Promise<Response> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${garminConfig.api.baseUrl}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
          // Keep-Alive 연결 재사용
          keepalive: true,
          // 타임아웃 설정
          signal: AbortSignal.timeout(15000), // 15초
        });

        if (response.ok) {
          return response;
        }

        // 401/403은 재시도하지 않음 (토큰 만료)
        if (response.status === 401 || response.status === 403) {
          throw new Error(`Authentication failed: ${response.status}`);
        }

        // 5xx 에러는 재시도
        if (response.status >= 500 && attempt < retries) {
          console.warn(
            `[GarminSync] API error ${response.status}, retrying (${attempt}/${retries})`
          );
          await this.delay(RETRY_DELAY_MS * attempt);
          continue;
        }

        throw new Error(`Garmin API error: ${response.status}`);
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        console.warn(
          `[GarminSync] Request failed, retrying (${attempt}/${retries}):`,
          error
        );
        await this.delay(RETRY_DELAY_MS * attempt);
      }
    }

    throw new Error("Max retries exceeded");
  }

  /**
   * 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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
      return true; // 에러 시 갱신
    }
  }

  /**
   * 가민 활동 데이터 동기화 (파트너 API 사용)
   */
  async syncActivities(
    userId: string,
    accessToken: string,
    options: {
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      background?: boolean;
    } = {}
  ): Promise<{ synced: number; status: string }> {
    const syncKey = `sync-${userId}`;

    // 중복 동기화 방지
    const currentSync = syncStatus.get(syncKey);
    if (currentSync?.inProgress) {
      const timeSinceLastAttempt = Date.now() - currentSync.lastAttempt;
      if (timeSinceLastAttempt < 30000) {
        // 30초 이내 재시도 방지
        console.log(`[GarminSync] Sync already in progress for user ${userId}`);
        return { synced: 0, status: "in_progress" };
      }
    }

    // 동기화 시작
    syncStatus.set(syncKey, { inProgress: true, lastAttempt: Date.now() });

    try {
      // 날짜 범위 설정 (기본: 최근 30일)
      const endDate = options.endDate || new Date();
      const startDate =
        options.startDate ||
        new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

      const uploadStartTime = Math.floor(startDate.getTime() / 1000);
      const uploadEndTime = Math.floor(endDate.getTime() / 1000);

      console.log(
        `[GarminSync] Fetching activities for user ${userId} (${startDate.toISOString()} ~ ${endDate.toISOString()})`
      );

      // 가민 API 전략:
      // 1. Dailies (일간 요약) - 빠르고 안정적
      // 2. Epochs (15분 단위) - 상세하지만 느림
      // 3. Activities - Activity API (별도 권한 필요)

      console.log(
        "[GarminSync] Fetching from Garmin Dailies API (recommended for activities)"
      );

      // Garmin Health API: Dailies Summary 사용 (활동 데이터 포함)
      // 문서 참조: Section 7.1 Daily Summaries
      const response = await this.garminFetchWithRetry(
        `/dailies?uploadStartTimeInSeconds=${uploadStartTime}&uploadEndTimeInSeconds=${uploadEndTime}`,
        accessToken
      );

      const dailies = await response.json();
      console.log(
        `[GarminSync] Received ${
          Array.isArray(dailies) ? dailies.length : 0
        } daily summaries`
      );

      // Daily summaries를 Activity 형식으로 변환
      const activities: GarminActivity[] = Array.isArray(dailies)
        ? dailies
            .filter((daily) => daily.steps > 0 || daily.activeKilocalories > 0) // 활동이 있는 날만
            .map((daily) => ({
              summaryId: daily.summaryId,
              activityName: `Daily Activity - ${daily.calendarDate}`,
              activityType: daily.activityType || "WALKING",
              startTimeInSeconds: daily.startTimeInSeconds,
              durationInSeconds:
                daily.activeTimeInSeconds || daily.durationInSeconds,
              distanceInMeters: daily.distanceInMeters,
              activeKilocalories: daily.activeKilocalories,
              averageHeartRateInBeatsPerMinute:
                daily.averageHeartRateInBeatsPerMinute,
              maxHeartRateInBeatsPerMinute: daily.maxHeartRateInBeatsPerMinute,
              minHeartRateInBeatsPerMinute: daily.minHeartRateInBeatsPerMinute,
              steps: daily.steps,
              moderateIntensityDurationInSeconds:
                daily.moderateIntensityDurationInSeconds,
              vigorousIntensityDurationInSeconds:
                daily.vigorousIntensityDurationInSeconds,
              floorsClimbed: daily.floorsClimbed,
              isManual: false,
              calendarDate: daily.calendarDate,
            }))
        : [];

      if (!Array.isArray(activities) || activities.length === 0) {
        console.log(`[GarminSync] No new activities found for user ${userId}`);
        return { synced: 0, status: "no_data" };
      }

      console.log(
        `[GarminSync] Found ${activities.length} activities, processing...`
      );

      // 배치 처리 (병렬로 처리하되 DB 부하 고려)
      const BATCH_SIZE = 10;
      let synced = 0;

      for (let i = 0; i < activities.length; i += BATCH_SIZE) {
        const batch = activities.slice(i, i + BATCH_SIZE);

        // 병렬 처리 (upsert)
        await Promise.all(
          batch.map(async (activity) => {
            try {
              await prisma.garminActivity.upsert({
                where: {
                  garminActivityId: activity.summaryId,
                },
                create: {
                  userId,
                  garminActivityId: activity.summaryId,
                  activityName: activity.activityName || "Unnamed Activity",
                  activityType: activity.activityType || "UNKNOWN",
                  startTime: new Date(activity.startTimeInSeconds * 1000),
                  endTime: activity.durationInSeconds
                    ? new Date(
                        (activity.startTimeInSeconds +
                          activity.durationInSeconds) *
                          1000
                      )
                    : null,
                  durationSeconds: activity.durationInSeconds || null,
                  distanceMeters: activity.distanceInMeters || null,
                  calories: activity.activeKilocalories || null,
                  avgHeartRate:
                    activity.averageHeartRateInBeatsPerMinute || null,
                  maxHeartRate: activity.maxHeartRateInBeatsPerMinute || null,
                  minHeartRate: activity.minHeartRateInBeatsPerMinute || null,
                  steps: activity.steps || null,
                  floorsClimbed: activity.floorsClimbed || null,
                  intensityMinutes:
                    ((activity.moderateIntensityDurationInSeconds || 0) +
                      (activity.vigorousIntensityDurationInSeconds || 0)) /
                      60 || null,
                  isManual: activity.isManual || false,
                  isAutoDetected: !activity.isManual,
                  rawData: JSON.parse(
                    JSON.stringify(activity)
                  ) as Prisma.InputJsonValue,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                update: {
                  activityName: activity.activityName || "Unnamed Activity",
                  activityType: activity.activityType || "UNKNOWN",
                  durationSeconds: activity.durationInSeconds || null,
                  distanceMeters: activity.distanceInMeters || null,
                  calories: activity.activeKilocalories || null,
                  avgHeartRate:
                    activity.averageHeartRateInBeatsPerMinute || null,
                  maxHeartRate: activity.maxHeartRateInBeatsPerMinute || null,
                  minHeartRate: activity.minHeartRateInBeatsPerMinute || null,
                  steps: activity.steps || null,
                  floorsClimbed: activity.floorsClimbed || null,
                  intensityMinutes:
                    ((activity.moderateIntensityDurationInSeconds || 0) +
                      (activity.vigorousIntensityDurationInSeconds || 0)) /
                      60 || null,
                  rawData: JSON.parse(
                    JSON.stringify(activity)
                  ) as Prisma.InputJsonValue,
                  updatedAt: new Date(),
                },
              });
              synced++;
            } catch (error) {
              console.error(
                `[GarminSync] Failed to upsert activity ${activity.summaryId}:`,
                error
              );
            }
          })
        );

        // 배치 간 짧은 대기 (DB 부하 분산)
        if (i + BATCH_SIZE < activities.length) {
          await this.delay(100);
        }
      }

      console.log(
        `[GarminSync] Successfully synced ${synced}/${activities.length} activities for user ${userId}`
      );

      return { synced, status: "success" };
    } catch (error) {
      console.error(`[GarminSync] Sync failed for user ${userId}:`, error);

      // 토큰 만료 시 재인증 플래그 설정
      if (
        error instanceof Error &&
        error.message.includes("Authentication failed")
      ) {
        await prisma.garminConnection.updateMany({
          where: { userId },
          data: { needsReauth: true },
        });
      }

      return { synced: 0, status: "error" };
    } finally {
      // 동기화 완료
      syncStatus.delete(syncKey);
    }
  }

  /**
   * 백그라운드 동기화 (비동기, 논블로킹)
   */
  async syncInBackground(userId: string, accessToken: string): Promise<void> {
    // Fire-and-forget: 결과를 기다리지 않음
    this.syncActivities(userId, accessToken, { background: true }).catch(
      (error) => {
        console.error(
          `[GarminSync] Background sync failed for ${userId}:`,
          error
        );
      }
    );
  }

  /**
   * 스마트 동기화: 필요 시에만 동기화
   */
  async syncIfNeeded(
    userId: string,
    accessToken: string,
    forceSync = false
  ): Promise<{ shouldSync: boolean; synced?: number; status: string }> {
    try {
      // 강제 동기화가 아니면 신선도 확인
      if (!forceSync) {
        const isStale = await this.isDataStale(userId);
        if (!isStale) {
          return {
            shouldSync: false,
            status: "fresh",
          };
        }
      }

      // 백그라운드 동기화 시작 (논블로킹)
      this.syncInBackground(userId, accessToken);

      return {
        shouldSync: true,
        status: "sync_initiated",
      };
    } catch (error) {
      console.error(`[GarminSync] syncIfNeeded error:`, error);
      return {
        shouldSync: false,
        status: "error",
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
