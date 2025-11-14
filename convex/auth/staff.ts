import { z } from "zod"
import { authZM, authZQ } from "../util"
import { DEFAULT_PERMISSIONS } from "@/lib/permissions"
import { ConvexError } from "convex/values"
import { staffCreateSchema, staffUpdateSchema } from "@/validations/staff"
import { hashPassword } from "better-auth/crypto"
import { atLeastOne } from "@/validations/_utils"

export const create = authZM({
  args: staffCreateSchema.safeExtend({ tenantId: z.string() }),
  handler: async (ctx, { tenantId, ...args }) => {
    const existingUser = await ctx.db
      .query("user")
      .withIndex("email_tenantId", (q) =>
        q.eq("email", args.email).eq("tenantId", tenantId)
      )
      .unique()

    if (existingUser) {
      throw new ConvexError("User with this email already exists")
    }

    const userPermissions = [...DEFAULT_PERMISSIONS, ...args.permissions]

    const userId = await ctx.db.insert("user", {
      tenantId,
      name: args.name,
      email: args.email,
      emailVerified: false,
      role: "staff",
      permissions: userPermissions,
      createdAt: Date.now(),
      updatedAt: Date.now()
    })

    const passwordHash = await hashPassword(args.password)

    await ctx.db.insert("account", {
      userId,
      accountId: crypto.randomUUID(),
      providerId: "credential",
      password: passwordHash,
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
  }
})

export const update = authZM({
  args: atLeastOne(staffUpdateSchema).safeExtend({
    id: z.string(),
    tenantId: z.string()
  }),
  handler: async (ctx, { tenantId, ...args }) => {
    const userId = ctx.db.normalizeId("user", args.id)
    if (!userId) {
      throw new ConvexError("Unauthorized")
    }

    const user = await ctx.db.get(userId)

    if (!user) {
      throw new ConvexError("User doesn't exist")
    }

    if (tenantId !== user.tenantId) {
      throw new ConvexError("Unauthorized")
    }

    if (user.role !== "staff") {
      throw new ConvexError("Can only update staff users")
    }

    if (args.email) {
      const emailTaken = await ctx.db
        .query("user")
        .withIndex("email_tenantId", (q) =>
          q.eq("email", args.email!).eq("tenantId", user.tenantId)
        )
        .unique()

      if (emailTaken && emailTaken._id !== user._id) {
        throw new ConvexError("User with this email already exists")
      }
    }

    const userPermissions = args.permissions
      ? [...DEFAULT_PERMISSIONS, ...args.permissions]
      : undefined

    await ctx.db.patch(userId, {
      name: args.name,
      email: args.email,
      permissions: userPermissions,
      updatedAt: Date.now()
    })
  }
})

export const del = authZM({
  args: { id: z.string(), tenantId: z.string() },
  handler: async (ctx, { id, tenantId }) => {
    const userId = ctx.db.normalizeId("user", id)
    if (!userId) {
      throw new ConvexError("Unauthorized")
    }

    const user = await ctx.db.get(userId)

    if (!user) {
      throw new ConvexError("User not found")
    }

    if (tenantId !== user.tenantId) {
      throw new ConvexError("Unauthorized")
    }

    if (user.role !== "staff") {
      throw new ConvexError("Can only delete staff users")
    }

    await ctx.db.delete(userId)
  }
})

export const list = authZQ({
  args: { tenantId: z.string() },
  handler: async (ctx, args) => {
    const staff = await ctx.db
      .query("user")
      .withIndex("role_tenantId", (q) =>
        q.eq("role", "staff").eq("tenantId", args.tenantId)
      )
      .collect()

    return staff
  }
})
