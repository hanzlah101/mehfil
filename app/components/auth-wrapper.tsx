import { PageLoader } from "@/components/page-loader"
import { LoginForm } from "@/components/auth/login-form"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"

export function AuthWrapper({ children }: React.PropsWithChildren) {
  return (
    <>
      <AuthLoading>
        <PageLoader />
      </AuthLoading>
      <Unauthenticated>
        <div className="flex min-h-svh flex-col justify-center px-4 py-12">
          <div className="mx-auto w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </Unauthenticated>
      <Authenticated>{children}</Authenticated>
    </>
  )
}
