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
          // Manual Activities Push Webhook
          if (Array.isArray(payload.activities)) {
            for (const activity of payload.activities) {
              await this.saveActivity(
                payload.userId,
                activity as Record<string, unknown>,
                true,
                false
              );
            }
          }
          break;

        case WEBHOOK_TYPES.MOVEIQ:
          // MoveIQ Push Webhook
          if (Array.isArray(payload.activities)) {
            for (const activity of payload.activities) {
              await this.saveActivity(
                payload.userId,
                activity as Record<string, unknown>,
                false,
                true
              );
            }
          }
          break;

        case WEBHOOK_TYPES.ACTIVITY_FILES:
          console.log("Activity file webhook:", payload);
          break;

        case WEBHOOK_TYPES.DEREGISTRATIONS:
          await prisma.garminConnection.deleteMany({
            where: { garminUserId: payload.userId },
          });
          break;

        case WEBHOOK_TYPES.PERMISSIONS:
          await prisma.garminConnection.updateMany({
            where: { garminUserId: payload.userId },
            data: { needsReauth: true },
          });
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
