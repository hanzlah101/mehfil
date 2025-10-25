import { Navigate } from "react-router"
import { PageLoader } from "@/components/page-loader"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"

export function AuthWrapper({ children }: React.PropsWithChildren) {
  return (
    <>
      <AuthLoading>
        <PageLoader />
      </AuthLoading>
      <Unauthenticated>
        <Navigate to="/login" replace />
      </Unauthenticated>
      <Authenticated>{children}</Authenticated>
    </>
  )
}
