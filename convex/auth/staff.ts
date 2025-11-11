import { authZM, authZQ } from "../util"
import { validateAuth } from "../auth"
import { DEFAULT_PERMISSIONS } from "@/lib/permissions"
import { ConvexError } from "convex/values"
import { staffSchema } from "@/validations/staff"
import { hashPassword } from "better-auth/crypto"
import { atLeastOne } from "@/validations/_utils"
import { zid } from "zodvex"

export const create = authZM({
  args: staffSchema,
  handler: async (ctx, args) => {
    const user = await validateAuth(ctx, "create:staff")

    const existingUser = await ctx.db
      .query("user")
      .withIndex("email_tenantId_deletedAt", (q) =>
        q
          .eq("email", args.email)
          .eq("tenantId", user.tenantId)
          .eq("deletedAt", null)
      )
      .unique()

    if (existingUser) {
      throw new ConvexError("User with this email already exists")
    }

    const userPermissions = [...DEFAULT_PERMISSIONS, ...args.permissions]

    const userId = await ctx.db.insert("user", {
      name: args.name,
      email: args.email,
      emailVerified: false,
      role: "staff",
      tenantId: user.tenantId,
      permissions: userPermissions,
      deletedAt: null,
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

    return userId
  }
})

export const update = authZM({
  args: atLeastOne(staffSchema).safeExtend({ id: zid("user") }),
  handler: async (ctx, args) => {
    const currentUser = await validateAuth(ctx, "update:staff")

    const user = await ctx.db.get(args.id)

    if (!user || user.deletedAt !== null) {
      throw new ConvexError("User doesn't exist")
    }

    if (currentUser.tenantId !== user.tenantId) {
      throw new ConvexError("Unauthorized")
    }

    if (user.role !== "staff") {
      throw new ConvexError("Can only update staff users")
    }

    if (args.email) {
      const emailTaken = await ctx.db
        .query("user")
        .withIndex("email_tenantId_deletedAt", (q) =>
          q
            .eq("email", args.email!)
            .eq("tenantId", user.tenantId)
            .eq("deletedAt", null)
        )
        .unique()

      if (emailTaken && emailTaken._id !== user._id) {
        throw new ConvexError("User with this email already exists")
      }
    }

    const userPermissions = args.permissions
      ? [...DEFAULT_PERMISSIONS, ...args.permissions]
      : undefined

    await ctx.db.patch(args.id, {
      name: args.name,
      email: args.email,
      permissions: userPermissions,
      updatedAt: Date.now()
    })

    if (args.password) {
      const account = await ctx.db
        .query("account")
        .withIndex("providerId_userId", (q) =>
          q.eq("providerId", "credential").eq("userId", user._id)
        )
        .unique()

      if (account) {
        const passwordHash = await hashPassword(args.password)
        await ctx.db.patch(account._id, { password: passwordHash })
      }
    }
  }
})

export const del = authZM({
  args: { id: zid("user") },
  handler: async (ctx, { id }) => {
    const currentUser = await validateAuth(ctx, "delete:staff")

    const user = await ctx.db.get(id)

    if (!user || user.deletedAt !== null) {
      throw new ConvexError("User not found")
    }

    if (currentUser.tenantId !== user.tenantId) {
      throw new ConvexError("Unauthorized")
    }

    if (user.role !== "staff") {
      throw new ConvexError("Can only delete staff users")
    }

    await ctx.db.patch(id, { deletedAt: Date.now() })
  }
})

export const list = authZQ({
  args: {},
  handler: async (ctx) => {
    const currentUser = await validateAuth(ctx, "read:staff")

    const staff = await ctx.db
      .query("user")
      .withIndex("role_tenantId_deletedAt", (q) =>
        q
          .eq("role", "staff")
          .eq("tenantId", currentUser.tenantId)
          .eq("deletedAt", null)
      )
      .collect()

    return staff
  }
})
