import { useMemo } from "react"
import { authClient } from "@/lib/auth-client"
import type { Permission } from "@/lib/permissions"

type ProtectedProps =
  | {
      perm: Permission
      children: React.ReactNode
      operator?: undefined
    }
  | {
      perm: Permission[]
      operator: "and" | "or"
      children: React.ReactNode
    }

export function Protected(props: ProtectedProps) {
  const { perm, children } = props
  const { data } = authClient.useSession()

  const hasPermission = useMemo(() => {
    const userPermissions = data?.user?.permissions

    if (Array.isArray(perm)) {
      const operator = props.operator

      if (operator === "or") {
        return perm.some((p) => userPermissions?.includes(p))
      }

      return perm.every((p) => userPermissions?.includes(p))
    }

    return userPermissions?.includes(perm)
  }, [data?.user?.permissions, perm, props.operator])

  if (!hasPermission) return null
  return children
}
