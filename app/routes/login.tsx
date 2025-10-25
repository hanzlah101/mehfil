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
        <div className="flex justify-center px-4 py-12 min-h-svh flex-col">
          <div className="mx-auto max-w-md w-full">
            <LoginForm />
          </div>
        </div>
      </Unauthenticated>
    </>
  )
}
