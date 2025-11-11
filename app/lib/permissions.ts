export const DEFAULT_PERMISSIONS = ["read:venues", "read:events"] as const

export const MANAGEABLE_PERMISSIONS = [
  "create:venue",
  "update:venue",
  "delete:venue",
  "create:event",
  "update:event",
  "delete:event"
] as const

export const ADMIN_ONLY_PERMISSIONS = [
  "create:staff",
  "update:staff",
  "delete:staff",
  "read:staff"
] as const

export const PERMISSIONS = [
  ...DEFAULT_PERMISSIONS,
  ...MANAGEABLE_PERMISSIONS,
  ...ADMIN_ONLY_PERMISSIONS
] as const

export type Permission = (typeof PERMISSIONS)[number]
