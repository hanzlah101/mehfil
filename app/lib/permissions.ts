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

export type ManageablePermission = (typeof MANAGEABLE_PERMISSIONS)[number]
export type Permission = (typeof PERMISSIONS)[number]

export function extractManageablePermissions(permissions: Permission[]) {
  return permissions.filter((p): p is ManageablePermission =>
    MANAGEABLE_PERMISSIONS.includes(p as ManageablePermission)
  )
}

export function formatPermission(permission: ManageablePermission) {
  return permission
    .replace(/:/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
