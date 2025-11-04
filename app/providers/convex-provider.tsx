import { toast } from "sonner"
import { ConvexError } from "convex/values"
import { ConvexQueryClient } from "@convex-dev/react-query"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import { authClient } from "@/lib/auth-client"
import {
  ConvexProvider as ConvexClientProvider,
  ConvexReactClient
} from "convex/react"

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL as string,
  { expectAuth: true }
)
const convexQueryClient = new ConvexQueryClient(convex)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn()
    },
    mutations: {
      onError: (err) => {
        if (err instanceof ConvexError && typeof err.data === "string") {
          toast.error(err.data)
        } else {
          toast.error("Something went wrong, please try again!")
        }
      }
    }
  }
})
convexQueryClient.connect(queryClient)

export function ConvexProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider client={convex}>
      <ConvexBetterAuthProvider authClient={authClient} client={convex}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ConvexBetterAuthProvider>
    </ConvexClientProvider>
  )
}
