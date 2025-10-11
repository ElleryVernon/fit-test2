/**
 * Garmin 관련 상수
 */

export const ACTIVITY_TYPES = {
  RUNNING: "running",
  CYCLING: "cycling",
  SWIMMING: "swimming",
  WALKING: "walking",
  HIKING: "hiking",
  FITNESS_EQUIPMENT: "fitness_equipment",
  OTHER: "other",
} as const;

export const WEBHOOK_TYPES = {
  ACTIVITIES: "activities",
  ACTIVITY_DETAILS: "activity-details",
  ACTIVITY_FILES: "activity-files",
  MANUAL_ACTIVITIES: "manual-activities",
  MOVEIQ: "moveiq",
  DEREGISTRATIONS: "deregistrations",
  PERMISSIONS: "permissions",
} as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[keyof typeof ACTIVITY_TYPES];
export type WebhookType = (typeof WEBHOOK_TYPES)[keyof typeof WEBHOOK_TYPES];
