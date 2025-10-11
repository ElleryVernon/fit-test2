/**
 * Garmin API 관련 타입 정의
 */

export interface GarminActivityType {
  RUNNING: "running";
  CYCLING: "cycling";
  SWIMMING: "swimming";
  WALKING: "walking";
  HIKING: "hiking";
  FITNESS_EQUIPMENT: "fitness_equipment";
  OTHER: "other";
}

export interface GarminWebhookType {
  ACTIVITIES: "activities";
  ACTIVITY_DETAILS: "activity-details";
  ACTIVITY_FILES: "activity-files";
  MANUAL_ACTIVITIES: "manual-activities";
  MOVEIQ: "moveiq";
  DEREGISTRATIONS: "deregistrations";
  PERMISSIONS: "permissions";
}

export interface GarminActivity {
  activityId: string;
  activityType: string;
  startTimeInSeconds: number;
  durationInSeconds: number;
  distanceInMeters?: number;
  caloriesBurned?: number;
  averageHeartRateInBeatsPerMinute?: number;
  maxHeartRateInBeatsPerMinute?: number;
}

export interface GarminUserProfile {
  userId: string;
  email?: string;
  displayName?: string;
}
