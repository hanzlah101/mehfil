export const BRAND_NAME = "Calendar"
export const EMPTY_NUMBER = undefined as unknown as number
export const DAY_DATE_FORMAT = "EEEE, dd LLL yyyy"

export const EVENT_STATUSES = [
  "completed",
  "booked",
  "reserved",
  "cancelled"
] as const

export type EventStatus = (typeof EVENT_STATUSES)[number]

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  completed: "Completed",
  booked: "Booked",
  reserved: "Reserved",
  cancelled: "Cancelled"
}

export const EVENT_STATUS_COLORS: Record<
  EventStatus,
  {
    bg: string
    text: string
    darkBg: string
    darkText: string
  }
> = {
  completed: {
    bg: "bg-green-100",
    text: "text-green-700",
    darkBg: "dark:bg-green-900/30",
    darkText: "dark:text-green-300"
  },
  booked: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    darkBg: "dark:bg-blue-900/30",
    darkText: "dark:text-blue-300"
  },
  reserved: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    darkBg: "dark:bg-purple-900/30",
    darkText: "dark:text-purple-300"
  },
  cancelled: {
    bg: "bg-red-100",
    text: "text-red-700",
    darkBg: "dark:bg-red-900/30",
    darkText: "dark:text-red-300"
  }
}
