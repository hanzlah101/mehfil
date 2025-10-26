import { Navigate } from "react-router"
import { LoginForm } from "@/components/auth/login-form"
import { PageLoader } from "@/components/page-loader"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"

export function meta() {
  return [
    { title: "Calendar - Login" },
    { name: "description", content: "Calendar - Login" }
  ]
}

export default function Login() {
  return (
    <>
      <AuthLoading>
        <PageLoader />
      </AuthLoading>
      <Authenticated>
        <Navigate to="/" replace />
      </Authenticated>
      <Unauthenticated>
        <div className="flex min-h-svh flex-col justify-center px-4 py-12">
          <div className="mx-auto w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </Unauthenticated>
    </>
  )
}
