export const BRAND_NAME = "Calendar"
export const EMPTY_NUMBER = undefined as unknown as number
export const DAY_DATE_FORMAT = "EEEE, dd LLL yyyy"

export const EVENT_STATUS = [
  "completed",
  "booked",
  "reserved",
  "cancelled"
] as const

export const ACTIVE_EVENT_STATUS = EVENT_STATUS.filter((s) => s !== "cancelled")

export type EventStatus = (typeof EVENT_STATUS)[number]

export const EVENT_STATUS_CLASSES: Record<EventStatus, string> = {
  completed:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  booked: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  reserved:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
}

export const SERIAL_CODE_PREFIX = "EVT"
