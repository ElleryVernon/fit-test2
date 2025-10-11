/**
 * Garmin 데이터 액세스 레이어
 * Garmin 연결 정보, 활동 데이터 등의 DB 작업을 담당
 */

import { prisma } from "@/lib/db/client";
import type { GarminConnection, Prisma } from "@prisma/client";

export class GarminRepository {
  /**
   * 사용자 ID로 Garmin 연결 정보 조회
   */
  async findConnectionByUserId(
    userId: string
  ): Promise<GarminConnection | null> {
    try {
      return await prisma.garminConnection.findFirst({
        where: { userId },
      });
    } catch (error) {
      console.error("[GarminRepository] findConnectionByUserId 오류:", error);
      return null;
    }
  }

  /**
   * Garmin 연결 정보 생성
   */
  async createConnection(
    data: Prisma.GarminConnectionUncheckedCreateInput
  ): Promise<GarminConnection> {
    try {
      return await prisma.garminConnection.create({ data });
    } catch (error) {
      console.error("[GarminRepository] createConnection 오류:", error);
      throw error;
    }
  }

  /**
   * Garmin 연결 정보 업데이트
   */
  async updateConnection(
    id: string,
    data: Prisma.GarminConnectionUpdateInput
  ): Promise<GarminConnection> {
    try {
      return await prisma.garminConnection.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error("[GarminRepository] updateConnection 오류:", error);
      throw error;
    }
  }

  /**
   * Garmin 연결 정보 삭제
   */
  async deleteConnection(id: string): Promise<GarminConnection> {
    try {
      return await prisma.garminConnection.delete({
        where: { id },
      });
    } catch (error) {
      console.error("[GarminRepository] deleteConnection 오류:", error);
      throw error;
    }
  }

  /**
   * OAuth State 저장
   */
  async saveOAuthState(data: {
    userId: string;
    state: string;
    codeVerifier: string;
  }): Promise<void> {
    try {
      await prisma.webhookLog.create({
        data: {
          type: "oauth_state",
          garminUserId: data.userId,
          summaryId: data.state,
          payload: {
            userId: data.userId,
            codeVerifier: data.codeVerifier,
            createdAt: Date.now(),
          },
          status: "pending",
        },
      });
    } catch (error) {
      console.error("[GarminRepository] saveOAuthState 오류:", error);
      throw error;
    }
  }

  /**
   * OAuth State 조회 및 검증
   */
  async findOAuthState(state: string): Promise<{
    userId: string;
    codeVerifier: string;
    createdAt: number;
  } | null> {
    try {
      const data = await prisma.webhookLog.findFirst({
        where: {
          type: "oauth_state",
          summaryId: state,
          status: "pending",
        },
      });

      if (!data) return null;

      return data.payload as {
        userId: string;
        codeVerifier: string;
        createdAt: number;
      };
    } catch (error) {
      console.error("[GarminRepository] findOAuthState 오류:", error);
      return null;
    }
  }

  /**
   * OAuth State 상태 업데이트
   */
  async updateOAuthStateStatus(
    state: string,
    status: string,
    errorMessage?: string
  ): Promise<void> {
    try {
      await prisma.webhookLog.updateMany({
        where: {
          type: "oauth_state",
          summaryId: state,
        },
        data: {
          status,
          errorMessage,
        },
      });
    } catch (error) {
      console.error("[GarminRepository] updateOAuthStateStatus 오류:", error);
      throw error;
    }
  }

  /**
   * Webhook 로그 생성
   */
  async createWebhookLog(data: Prisma.WebhookLogCreateInput) {
    try {
      return await prisma.webhookLog.create({ data });
    } catch (error) {
      console.error("[GarminRepository] createWebhookLog 오류:", error);
      throw error;
    }
  }

  /**
   * 사용자의 활동 통계 조회
   */
  async getUserActivityStats(userId: string, days: number = 7) {
    try {
      // TODO: 실제 garminActivities 테이블 구현 시 업데이트 필요
      return {
        totalActivities: 0,
        totalDistance: 0,
        totalCalories: 0,
        period: `${days} days`,
      };
    } catch (error) {
      console.error("[GarminRepository] getUserActivityStats 오류:", error);
      return null;
    }
  }
}

// Singleton 인스턴스 export
export const garminRepository = new GarminRepository();
