export const GARMIN_API_BASE_URL = process.env.GARMIN_API_BASE_URL || 
  'https://apis.garmin.com/wellness-api/rest'

export const ACTIVITY_TYPES = {
  RUNNING: 'running',
  CYCLING: 'cycling',
  SWIMMING: 'swimming',
  WALKING: 'walking',
  HIKING: 'hiking',
  FITNESS_EQUIPMENT: 'fitness_equipment',
  OTHER: 'other'
} as const

export const WEBHOOK_TYPES = {
  ACTIVITIES: 'activities',
  ACTIVITY_DETAILS: 'activity-details',
  ACTIVITY_FILES: 'activity-files',
  MANUAL_ACTIVITIES: 'manual-activities',
  MOVEIQ: 'moveiq',
  DEREGISTRATIONS: 'deregistrations',
  PERMISSIONS: 'permissions'
} as const