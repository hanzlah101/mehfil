import { z } from "zod"
import { query } from "./_generated/server"
import { components } from "./_generated/api"
import { validateAuth } from "./auth"
import { zm } from "./util"
import { staffCreateSchema, staffUpdateSchema } from "@/validations/staff"
import { atLeastOne } from "@/validations/_utils"
import type { Doc } from "./auth/_generated/dataModel"

export const create = zm({
  args: staffCreateSchema,
  handler: async (ctx, args) => {
    const currentUser = await validateAuth(ctx, "create:staff")
    await ctx.runMutation(components.betterAuth.staff.create, {
      tenantId: currentUser.tenantId,
      ...args
    })
  }
})

export const update = zm({
  args: atLeastOne(staffUpdateSchema).safeExtend({ id: z.string() }),
  handler: async (ctx, args) => {
    const currentUser = await validateAuth(ctx, "update:staff")
    await ctx.runMutation(components.betterAuth.staff.update, {
      tenantId: currentUser.tenantId,
      ...args
    })
  }
})

export const del = zm({
  args: { id: z.string() },
  handler: async (ctx, args) => {
    const currentUser = await validateAuth(ctx, "delete:staff")
    await ctx.runMutation(components.betterAuth.staff.del, {
      tenantId: currentUser.tenantId,
      ...args
    })
  }
})

export const list = query({
  handler: async (ctx) => {
    const currentUser = await validateAuth(ctx, "read:staff")
    const staff = await ctx.runQuery(components.betterAuth.staff.list, {
      tenantId: currentUser.tenantId
    })

    return staff as Doc<"user">[]
  }
})
