import authSchema from "./auth/schema"
import { createClient, type GenericCtx } from "@convex-dev/better-auth"
import { convex, crossDomain } from "@convex-dev/better-auth/plugins"
import { components } from "./_generated/api"
import { APIError, betterAuth } from "better-auth"
import { ConvexError } from "convex/values"
import { query } from "./_generated/server"
import { PERMISSIONS, type Permission } from "@/lib/permissions"
import { createAuthMiddleware } from "better-auth/plugins"
import type { Doc } from "./auth/_generated/dataModel"
import type { DataModel, Id } from "./_generated/dataModel"
import type { DataModel as AuthDataModel } from "./auth/_generated/dataModel"
import type { MutationCtx, QueryCtx } from "./_generated/server"

const siteUrl = process.env.SITE_URL!

export const authComponent = createClient<AuthDataModel, typeof authSchema>(
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
    database: authComponent.adapter(ctx as MutationCtx),
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
    },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path === "/sign-in/email") {
          const user = (await ctx.context.adapter.findOne({
            model: "user",
            where: [{ field: "email", value: ctx.body.email }]
          })) as Doc<"user">

          if (user?.deletedAt) {
            throw new APIError("NOT_FOUND", {
              message: "User doesn't exist"
            })
          }
        }
      })
    }
  })
}

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => authComponent.getAuthUser(ctx as MutationCtx)
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
  const user = await authComponent.getAuthUser(ctx as MutationCtx)
  if (!user) throw new ConvexError("Unauthorized")

  if (!permission) return user

  if (!user.tenantId || !user.permissions?.includes(permission)) {
    throw new ConvexError("Forbidden")
  }

  return user
}
