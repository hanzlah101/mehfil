export const EVENT_STATUSES = [
  "completed",
  "booked",
  "reserved",
  "cancelled"
] as const

export type EventStatus = (typeof EVENT_STATUSES)[number]
