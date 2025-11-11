import { z } from "zod"
import { hashPassword } from "better-auth/crypto"
import { components } from "./_generated/api"
import { validateAuth } from "./auth"
import { zm } from "./util"
import { staffCreateSchema, staffUpdateSchema } from "@/validations/staff"
import { atLeastOne } from "@/validations/_utils"
import type { Doc } from "./auth/_generated/dataModel"
import { query } from "./_generated/server"

export const create = zm({
  args: staffCreateSchema,
  handler: async (ctx, args) => {
    const currentUser = await validateAuth(ctx, "create:staff")
    const now = Date.now()

    const user = await ctx.runMutation(components.betterAuth.adapter.create, {
      input: {
        model: "user",
        data: {
          name: args.name,
          email: args.email,
          permissions: args.permissions,
          emailVerified: false,
          role: "staff",
          tenantId: currentUser.tenantId,
          createdAt: now,
          updatedAt: now,
          deletedAt: null
        }
      }
    })

    const passwordHash = await hashPassword(args.password)

    await ctx.runMutation(components.betterAuth.adapter.create, {
      input: {
        model: "account",
        data: {
          accountId: crypto.randomUUID(),
          providerId: "credential",
          password: passwordHash,
          userId: user._id,
          createdAt: now,
          updatedAt: now
        }
      }
    })
  }
})

export const update = zm({
  args: atLeastOne(staffUpdateSchema).safeExtend({ id: z.string() }),
  handler: async (ctx, { id, ...args }) => {
    const currentUser = await validateAuth(ctx, "update:staff")
    const now = Date.now()

    const user = (await ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: "user",
      where: [{ field: "_id", value: id }]
    })) as Doc<"user">

    if (!user || user.deletedAt !== null) {
      throw new Error("User doesn't exist")
    }

    if (currentUser.tenantId !== user.tenantId) {
      throw new Error("Unauthorized")
    }

    if (user.role !== "staff") {
      throw new Error("Can only update staff users")
    }

    if (args.email) {
      const emailTaken = (await ctx.runQuery(
        components.betterAuth.adapter.findOne,
        {
          model: "user",
          where: [
            { field: "email", value: args.email },
            { field: "tenantId", value: user.tenantId },
            { field: "deletedAt", value: null }
          ]
        }
      )) as Doc<"user">

      if (emailTaken && emailTaken._id !== user._id) {
        throw new Error("User with this email already exists")
      }
    }

    await ctx.runMutation(components.betterAuth.adapter.updateOne, {
      input: {
        model: "user",
        where: [{ field: "_id", value: id }],
        update: {
          name: args.name,
          email: args.email,
          permissions: args.permissions,
          updatedAt: now
        }
      }
    })
  }
})

export const del = zm({
  args: { id: z.string() },
  handler: async (ctx, { id }) => {
    const currentUser = await validateAuth(ctx, "delete:staff")
    const now = Date.now()

    const user = (await ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: "user",
      where: [{ field: "_id", value: id }]
    })) as Doc<"user">

    if (!user || user.deletedAt !== null) {
      throw new Error("User not found")
    }

    if (currentUser.tenantId !== user.tenantId) {
      throw new Error("Unauthorized")
    }

    if (user.role !== "staff") {
      throw new Error("Can only delete staff users")
    }

    await ctx.runMutation(components.betterAuth.adapter.updateOne, {
      input: {
        model: "user",
        where: [{ field: "_id", value: id }],
        update: { deletedAt: now }
      }
    })
  }
})

export const list = query({
  handler: async (ctx, {}) => {
    const currentUser = await validateAuth(ctx, "read:staff")

    const result = await ctx.runQuery(components.betterAuth.adapter.findMany, {
      model: "user",
      paginationOpts: { cursor: null, numItems: 100 },
      where: [
        { field: "tenantId", value: currentUser.tenantId },
        { field: "role", value: "staff" },
        { field: "deletedAt", value: null }
      ]
    })

    return result.page as Doc<"user">[]
  }
})
