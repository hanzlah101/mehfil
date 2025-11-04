import authSchema from "./auth/schema"
import { createClient, type GenericCtx } from "@convex-dev/better-auth"
import { convex, crossDomain } from "@convex-dev/better-auth/plugins"
import { components } from "./_generated/api"
import { betterAuth } from "better-auth"
import { ConvexError } from "convex/values"
import { query } from "./_generated/server"
import { PERMISSIONS, type Permission } from "@/lib/permissions"
import type { MutationCtx, QueryCtx } from "./_generated/server"
import type { DataModelFromSchemaDefinition } from "convex/server"
import type schema from "./schema"
import type { Doc } from "./auth/_generated/dataModel"
import type { Id } from "./_generated/dataModel"

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
          required: false,
          input: false
        },
        role: {
          type: "string",
          required: true,
          input: false
        },
        permissions: {
          type: [...PERMISSIONS],
          required: false,
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

type BaseUser = Doc<"user">
type TenantUser = Omit<Doc<"user">, "tenantId"> & {
  tenantId: Id<"tenants">
}

type CTX = QueryCtx | MutationCtx

export async function validateAuth(ctx: CTX): Promise<BaseUser>
export async function validateAuth(
  ctx: CTX,
  permission: Permission
): Promise<TenantUser>
export async function validateAuth(ctx: CTX, permission?: Permission) {
  const user = await authComponent.getAuthUser(ctx)
  if (!user) throw new ConvexError("Unauthorized")

  if (!permission) return user

  if (!user.tenantId || !user.permissions?.includes(permission)) {
    throw new ConvexError("Forbidden")
  }

  return user
}
