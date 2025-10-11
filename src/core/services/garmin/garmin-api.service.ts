/**
 * Garmin API 호출 서비스
 */

import { garminConfig } from "@/config";

export class GarminApiService {
  /**
   * Garmin API 호출 헬퍼
   */
  private async garminFetch(
    endpoint: string,
    accessToken: string,
    options?: RequestInit
  ) {
    const response = await fetch(`${garminConfig.api.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Garmin API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * 활동 목록 가져오기
   */
  async fetchActivities(accessToken: string, startDate?: Date, endDate?: Date) {
    const params = new URLSearchParams();
    if (startDate)
      params.append("startDate", startDate.toISOString().split("T")[0]);
    if (endDate) params.append("endDate", endDate.toISOString().split("T")[0]);

    return this.garminFetch(`/activities?${params}`, accessToken);
  }

  /**
   * 특정 활동 상세 정보
   */
  async fetchActivityDetails(activityId: string, accessToken: string) {
    return this.garminFetch(`/activities/${activityId}`, accessToken);
  }

  /**
   * 활동 파일 (FIT, TCX, GPX)
   */
  async fetchActivityFile(
    activityId: string,
    fileType: string,
    accessToken: string
  ) {
    const response = await fetch(
      `${garminConfig.api.baseUrl}/activities/${activityId}/files/${fileType}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch activity file: ${response.status}`);
    }

    return response.blob();
  }
}

// Singleton 인스턴스 export
export const garminApiService = new GarminApiService();
