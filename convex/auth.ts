import { createClient, type GenericCtx } from "@convex-dev/better-auth"
import { convex, crossDomain } from "@convex-dev/better-auth/plugins"
import { components } from "./_generated/api"
import { query } from "./_generated/server"
import { betterAuth } from "better-auth"
import authSchema from "./betterAuth/schema"
import type { DataModelFromSchemaDefinition } from "convex/server"
import type schema from "./schema"

const siteUrl = process.env.SITE_URL!

type DataModel = DataModelFromSchemaDefinition<typeof schema>

export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  { local: { schema: authSchema } }
)

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    logger: {
      disabled: optionsOnly
    },
    trustedOrigins: [siteUrl],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      requireEmailVerification: false
    },
    plugins: [crossDomain({ siteUrl }), convex()],
    user: {
      additionalFields: {
        tenantId: {
          type: "string",
          required: true,
          input: false
        },
        role: {
          type: "string",
          required: true,
          input: false
        }
      }
    }
  })
}

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => authComponent.getAuthUser(ctx)
})
