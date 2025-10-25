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

/**
 * Render the login route UI that shows a loading indicator, redirects authenticated users, and displays the login form for unauthenticated users.
 *
 * @returns A JSX element representing the login route: a loading state while authentication status is pending, a redirect to the root path for authenticated users, or the centered login form for unauthenticated users.
 */
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