/**
 * Garmin Webhook 처리 서비스
 */

import { prisma } from "@/lib/db/client";
import { WEBHOOK_TYPES } from "@/constants";

type GarminWebhookPayload = {
  userId: string;
  userAccessToken: string;
  summaryId?: string;
  fileType?: string;
  callbackURL?: string;
  activities?: unknown[];
  activityDetails?: Array<{
    userId: string;
    summaryId: string;
    activityId: number;
    summary: Record<string, unknown>;
    samples?: Array<Record<string, unknown>>;
  }>;
  moveIQActivities?: Array<{
    userId: string;
    summaryId: string;
    calendarDate: string;
    startTimeInSeconds: number;
    durationInSeconds: number;
    activityType: string;
    activitySubType?: string;
    offsetInSeconds: number;
  }>;
  manualActivities?: Array<Record<string, unknown>>;
  userPermissionsChange?: Array<{
    userId: string;
    summaryId: string;
    permissions: string[];
    changeTimeInSeconds: number;
  }>;
  deregistrations?: Array<{
    userId: string;
  }>;
  dailies?: Array<Record<string, unknown>>;
  epochs?: Array<Record<string, unknown>>;
  sleeps?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

export class GarminWebhookService {
  /**
   * Webhook 로그 저장
   */
  async saveWebhookLog(type: string, payload: GarminWebhookPayload) {
    const data = await prisma.webhookLog.create({
      data: {
        type,
        garminUserId: payload.userId,
        summaryId: payload.summaryId,
        fileType: payload.fileType,
        callbackUrl: payload.callbackURL,
        payload: payload as never,
        status: "pending",
      },
    });

    return data;
  }

  /**
   * 활동 데이터 저장/업데이트
   */
  async saveActivity(
    garminUserId: string,
    activityData: Record<string, unknown>,
    isManual: boolean = false,
    isAutoDetected: boolean = false
  ) {
    console.log(
      `[saveActivity] Looking for connection with garminUserId: ${garminUserId}`
    );

    const connection = await prisma.garminConnection.findFirst({
      where: { garminUserId },
      select: { userId: true },
    });

    if (!connection) {
      console.error(
        `[saveActivity] ❌ Connection not found for garminUserId: ${garminUserId}`
      );
      throw new Error(`Garmin connection not found for user: ${garminUserId}`);
    }

    console.log(
      `[saveActivity] ✅ Found connection, userId: ${connection.userId}`
    );

    // Activity ID는 문자열로 변환 (숫자로 올 수 있음)
    const activityId =
      activityData.activityId?.toString() || activityData.summaryId?.toString();

    if (!activityId) {
      console.error(
        "[saveActivity] ❌ No activityId or summaryId in data:",
        activityData
      );
      throw new Error("Missing activityId or summaryId");
    }

    const activityRecord = {
      userId: connection.userId,
      garminActivityId: activityId,
      activityName: (activityData.activityName as string) || "Unnamed Activity",
      activityType: (activityData.activityType as string) || "UNKNOWN",
      startTime: new Date((activityData.startTimeInSeconds as number) * 1000),
      endTime: activityData.endTimeInSeconds
        ? new Date((activityData.endTimeInSeconds as number) * 1000)
        : activityData.durationInSeconds
        ? new Date(
            ((activityData.startTimeInSeconds as number) +
              (activityData.durationInSeconds as number)) *
              1000
          )
        : null,
      durationSeconds: activityData.durationInSeconds as number | null,
      distanceMeters: activityData.distanceInMeters as number | null,
      calories: (activityData.activeKilocalories || activityData.calories) as
        | number
        | null,
      avgHeartRate: activityData.averageHeartRateInBeatsPerMinute as
        | number
        | null,
      maxHeartRate: activityData.maxHeartRateInBeatsPerMinute as number | null,
      minHeartRate: activityData.minHeartRateInBeatsPerMinute as number | null,
      steps: (activityData.steps || activityData.pushes) as number | null,
      floorsClimbed: (activityData.floorsClimbed ||
        activityData.totalElevationGainInMeters) as number | null,
      intensityMinutes: activityData.moderateIntensityMinutes as number | null,
      stressLevel: activityData.averageStressLevel as number | null,
      isManual,
      isAutoDetected,
      rawData: activityData as never,
    };

    console.log(
      `[saveActivity] Activity record prepared:`,
      JSON.stringify({
        garminActivityId: activityRecord.garminActivityId,
        activityType: activityRecord.activityType,
        startTime: activityRecord.startTime,
        userId: activityRecord.userId,
      })
    );

    console.log(
      `[saveActivity] Upserting activity: ${activityRecord.garminActivityId}`
    );

    const data = await prisma.garminActivity.upsert({
      where: { garminActivityId: activityRecord.garminActivityId },
      update: activityRecord,
      create: activityRecord,
    });

    console.log(`[saveActivity] ✅ Activity upserted successfully: ${data.id}`);

    return data;
  }

  /**
   * Webhook 처리
   */
  async processWebhook(webhookId: string) {
    const webhook = await prisma.webhookLog.findUnique({
      where: { id: webhookId },
    });

    if (!webhook) {
      console.error("Webhook not found:", webhookId);
      return;
    }

    if (webhook.status !== "pending") {
      console.log("Webhook already processed:", webhookId);
      return;
    }

    try {
      await prisma.webhookLog.update({
        where: { id: webhookId },
        data: { status: "processing" },
      });

      const payload = webhook.payload as GarminWebhookPayload;

      switch (webhook.type) {
        case WEBHOOK_TYPES.ACTIVITIES:
          // Activities Push Webhook 처리
          if (Array.isArray(payload.activities)) {
            console.log(
              `[Webhook] Processing ${payload.activities.length} activities`
            );

            for (const activityData of payload.activities) {
              const activity = activityData as {
                userId: string;
                activityId: number;
                [key: string]: unknown;
              };

              console.log(
                `[Webhook] Processing activity ${activity.activityId} for user ${activity.userId}`
              );

              try {
                const saved = await this.saveActivity(
                  activity.userId,
                  activity as Record<string, unknown>,
                  false,
                  false
                );
                console.log(
                  `[Webhook] ✅ Activity saved: ${saved.garminActivityId}`
                );
              } catch (error) {
                console.error(
                  `[Webhook] ❌ Failed to save activity ${activity.activityId}:`,
                  error
                );
                throw error;
              }
            }
          }
          break;

        case WEBHOOK_TYPES.ACTIVITY_DETAILS:
          // Activity Details Push Webhook 처리
          if (Array.isArray(payload.activityDetails)) {
            console.log(
              `[Webhook] Processing ${payload.activityDetails.length} activity details`
            );

            for (const activityDetail of payload.activityDetails) {
              console.log(
                `[Webhook] Processing activity detail ${activityDetail.activityId} for user ${activityDetail.userId}`
              );

              const summary = activityDetail.summary;
              if (summary) {
                try {
                  const saved = await this.saveActivity(
                    activityDetail.userId,
                    summary,
                    false,
                    false
                  );
                  console.log(
                    `[Webhook] ✅ Activity detail saved: ${saved.garminActivityId}`
                  );
                } catch (error) {
                  console.error(
                    `[Webhook] ❌ Failed to save activity detail ${activityDetail.activityId}:`,
                    error
                  );
                  throw error;
                }
              }
            }
          }
          break;

        case WEBHOOK_TYPES.MANUAL_ACTIVITIES:
          // Manual Activities Push Webhook (GC_ACTIVITY_UPDATE)
          if (Array.isArray(payload.manualActivities)) {
            console.log(
              `[Webhook] Processing ${payload.manualActivities.length} manual activities`
            );

            for (const activityData of payload.manualActivities) {
              const activity = activityData as {
                userId: string;
                activityId: number;
                [key: string]: unknown;
              };

              console.log(
                `[Webhook] Processing manual activity ${activity.activityId} for user ${activity.userId}`
              );

              try {
                const saved = await this.saveActivity(
                  activity.userId,
                  activity as Record<string, unknown>,
                  true, // isManual = true
                  false
                );
                console.log(
                  `[Webhook] ✅ Manual activity saved: ${saved.garminActivityId}`
                );
              } catch (error) {
                console.error(
                  `[Webhook] ❌ Failed to save manual activity:`,
                  error
                );
                throw error;
              }
            }
          }
          break;

        case WEBHOOK_TYPES.MOVEIQ:
          // MoveIQ Push Webhook (자동 활동 감지)
          if (Array.isArray(payload.moveIQActivities)) {
            console.log(
              `[Webhook] Processing ${payload.moveIQActivities.length} MoveIQ activities`
            );

            for (const moveIQ of payload.moveIQActivities) {
              console.log(
                `[Webhook] Processing MoveIQ ${moveIQ.activityType}${
                  moveIQ.activitySubType ? ` (${moveIQ.activitySubType})` : ""
                } for user ${moveIQ.userId}`
              );

              try {
                // MoveIQ 데이터를 Activity 형식으로 변환
                const activityData: Record<string, unknown> = {
                  summaryId: moveIQ.summaryId,
                  activityName: moveIQ.activitySubType
                    ? `${moveIQ.activityType} - ${moveIQ.activitySubType}`
                    : moveIQ.activityType,
                  activityType: moveIQ.activityType,
                  startTimeInSeconds: moveIQ.startTimeInSeconds,
                  durationInSeconds: moveIQ.durationInSeconds,
                  startTimeOffsetInSeconds: moveIQ.offsetInSeconds,
                  calendarDate: moveIQ.calendarDate,
                };

                const saved = await this.saveActivity(
                  moveIQ.userId,
                  activityData,
                  false,
                  true // isAutoDetected = true (MoveIQ는 자동 감지)
                );

                console.log(
                  `[Webhook] ✅ MoveIQ activity saved: ${saved.garminActivityId}`
                );
              } catch (error) {
                console.error(
                  `[Webhook] ❌ Failed to save MoveIQ activity:`,
                  error
                );
                throw error;
              }
            }
          }
          break;

        case WEBHOOK_TYPES.ACTIVITY_FILES:
          console.log("Activity file webhook:", payload);
          break;

        case WEBHOOK_TYPES.DEREGISTRATIONS:
          // User Deregistration Webhook (USER_DEREG)
          if (Array.isArray(payload.deregistrations)) {
            console.log(
              `[Webhook] Processing ${payload.deregistrations.length} deregistrations`
            );

            for (const dereg of payload.deregistrations) {
              console.log(`[Webhook] Deregistering user ${dereg.userId}`);

              try {
                // 연결 삭제
                const deleted = await prisma.garminConnection.deleteMany({
                  where: { garminUserId: dereg.userId },
                });

                console.log(
                  `[Webhook] ✅ User deregistered: ${dereg.userId} (${deleted.count} connections deleted)`
                );
              } catch (error) {
                console.error(`[Webhook] ❌ Failed to deregister user:`, error);
                throw error;
              }
            }
          }
          break;

        case WEBHOOK_TYPES.PERMISSIONS:
          // User Permissions Change Webhook (CONSUMER_PERMISSIONS)
          if (Array.isArray(payload.userPermissionsChange)) {
            console.log(
              `[Webhook] Processing ${payload.userPermissionsChange.length} permission changes`
            );

            for (const permChange of payload.userPermissionsChange) {
              console.log(
                `[Webhook] Permission change for user ${
                  permChange.userId
                }: ${permChange.permissions.join(", ")}`
              );

              try {
                // 권한 업데이트
                await prisma.garminConnection.updateMany({
                  where: { garminUserId: permChange.userId },
                  data: {
                    scopes: permChange.permissions,
                    updatedAt: new Date(),
                  },
                });

                console.log(
                  `[Webhook] ✅ Permissions updated for ${permChange.userId}`
                );
              } catch (error) {
                console.error(
                  `[Webhook] ❌ Failed to update permissions:`,
                  error
                );
                throw error;
              }
            }
          }
          break;
      }

      await prisma.webhookLog.update({
        where: { id: webhookId },
        data: {
          status: "success",
          processedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Webhook processing error:", error);

      await prisma.webhookLog.update({
        where: { id: webhookId },
        data: {
          status: "failed",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          retryCount: webhook.retryCount + 1,
        },
      });

      throw error;
    }
  }

  /**
   * Webhook 검증
   */
  verifyWebhookPayload(payload: Record<string, unknown>): boolean {
    console.log("🔍 [Webhook Validation] Checking payload structure...");

    if (!payload || typeof payload !== "object") {
      console.error("❌ [Webhook Validation] Payload is not an object");
      return false;
    }

    // Garmin Webhook 필드 확인
    const hasAnyGarminField =
      payload.userId ||
      payload.userAccessToken ||
      payload.summaryId ||
      payload.fileType ||
      payload.callbackURL ||
      payload.activities ||
      payload.activityDetails || // Activity Details Webhook
      payload.moveIQActivities || // MoveIQ Webhook
      payload.manualActivities || // Manual Activities Webhook
      payload.userPermissionsChange || // User Permissions Webhook
      payload.deregistrations || // Deregistration Webhook
      payload.dailies || // Daily Summaries Webhook
      payload.epochs || // Epoch Summaries Webhook
      payload.sleeps || // Sleep Summaries Webhook
      payload.bodyComps || // Body Composition Webhook
      payload.stressDetails || // Stress Details Webhook
      payload.userMetrics || // User Metrics Webhook
      payload.pulseox || // Pulse Ox Webhook
      payload.allDayRespiration || // Respiration Webhook
      payload.healthSnapshot || // Health Snapshot Webhook
      payload.hrv || // HRV Webhook
      payload.bloodPressures || // Blood Pressure Webhook
      payload.skinTemp || // Skin Temperature Webhook
      payload.deregistrations || // Deregistration Webhook
      Array.isArray(payload);

    if (!hasAnyGarminField) {
      console.error(
        "❌ [Webhook Validation] No recognizable Garmin webhook fields found",
        Object.keys(payload)
      );
      return false;
    }

    console.log("✅ [Webhook Validation] Payload structure is valid");
    return true;
  }
}

// Singleton 인스턴스 export
export const garminWebhookService = new GarminWebhookService();
