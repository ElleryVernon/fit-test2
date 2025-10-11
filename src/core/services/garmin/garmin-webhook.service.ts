/**
 * Garmin Webhook 처리 서비스
 */

import { prisma } from "@/lib/db/client";
import { garminApiService } from "./garmin-api.service";
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
    const connection = await prisma.garminConnection.findFirst({
      where: { garminUserId },
      select: { userId: true },
    });

    if (!connection) {
      throw new Error(`Garmin connection not found for user: ${garminUserId}`);
    }

    const activityRecord = {
      userId: connection.userId,
      garminActivityId: (activityData.activityId ||
        activityData.summaryId) as string,
      activityName: activityData.activityName as string | undefined,
      activityType: (activityData.activityType as string) || "other",
      startTime: new Date((activityData.startTimeInSeconds as number) * 1000),
      endTime: activityData.endTimeInSeconds
        ? new Date((activityData.endTimeInSeconds as number) * 1000)
        : null,
      durationSeconds: activityData.durationInSeconds as number | undefined,
      distanceMeters: activityData.distanceInMeters as number | undefined,
      calories: (activityData.activeKilocalories || activityData.calories) as
        | number
        | undefined,
      avgHeartRate: activityData.averageHeartRateInBeatsPerMinute as
        | number
        | undefined,
      maxHeartRate: activityData.maxHeartRateInBeatsPerMinute as
        | number
        | undefined,
      minHeartRate: activityData.minHeartRateInBeatsPerMinute as
        | number
        | undefined,
      steps: activityData.steps as number | undefined,
      floorsClimbed: activityData.floorsClimbed as number | undefined,
      intensityMinutes: activityData.moderateIntensityMinutes as
        | number
        | undefined,
      stressLevel: activityData.averageStressLevel as number | undefined,
      isManual,
      isAutoDetected,
      rawData: activityData as never,
    };

    const data = await prisma.garminActivity.upsert({
      where: { garminActivityId: activityRecord.garminActivityId },
      update: activityRecord,
      create: activityRecord,
    });

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
        case WEBHOOK_TYPES.ACTIVITY_DETAILS:
          // Activity Details Push Webhook 처리
          if (Array.isArray(payload.activityDetails)) {
            console.log(
              `[Webhook] Processing ${payload.activityDetails.length} activity details`
            );

            for (const activityDetail of payload.activityDetails) {
              const summary = activityDetail.summary;
              if (summary) {
                await this.saveActivity(
                  activityDetail.userId,
                  summary,
                  false,
                  false
                );
              }
            }
          } else if (payload.summaryId) {
            // Ping 방식 (Callback URL)
            const activityData = await garminApiService.fetchActivityDetails(
              payload.summaryId,
              payload.userAccessToken
            );
            await this.saveActivity(payload.userId, activityData);
          }
          break;

        case WEBHOOK_TYPES.MANUAL_ACTIVITIES:
          if (payload.summaryId) {
            const activityData = await garminApiService.fetchActivityDetails(
              payload.summaryId,
              payload.userAccessToken
            );
            await this.saveActivity(payload.userId, activityData, true, false);
          }
          break;

        case WEBHOOK_TYPES.MOVEIQ:
          if (payload.summaryId) {
            const activityData = await garminApiService.fetchActivityDetails(
              payload.summaryId,
              payload.userAccessToken
            );
            await this.saveActivity(payload.userId, activityData, false, true);
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
