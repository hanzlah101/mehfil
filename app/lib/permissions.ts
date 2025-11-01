export const PERMISSIONS = [
  "create:venue",
  "read:venues",
  "update:venue",
  "delete:venue",
  "create:event",
  "read:events",
  "update:event",
  "delete:event"
] as const

export type Permission = (typeof PERMISSIONS)[number]
