import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import {
  convexClient,
  crossDomainClient
} from "@convex-dev/better-auth/client/plugins"
import type { createAuth } from "@db/auth"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_CONVEX_SITE_URL,
  plugins: [
    convexClient(),
    crossDomainClient(),
    inferAdditionalFields<ReturnType<typeof createAuth>>()
  ]
})
