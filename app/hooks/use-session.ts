import { useCallback } from "react"
import { authClient } from "@/lib/auth-client"
import type { Permission } from "@/lib/permissions"

export function useSession() {
  const { data, ...query } = authClient.useSession()

  const can = useCallback(
    (permission: Permission) => {
      return data?.user.permissions?.includes(permission)
    },
    [data]
  )

  return { ...data, ...query, can }
}
