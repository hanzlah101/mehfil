import { zid } from "zodvex"
import { zm } from "./util"
import { validateAuth } from "./auth"
import { addonSchema } from "@/validations/addons"
import { ConvexError } from "convex/values"
import { query } from "./_generated/server"
import { atLeastOne } from "@/validations/_utils"

export const create = zm({
  args: addonSchema,
  handler: async (ctx, args) => {
    const user = await validateAuth(ctx, "create:addon")

    await ctx.db.insert("addons", {
      ...args,
      deletedAt: null,
      tenantId: user.tenantId
    })
  }
})

export const update = zm({
  args: atLeastOne(addonSchema).safeExtend({ id: zid("addons") }),
  handler: async (ctx, { id, ...args }) => {
    const user = await validateAuth(ctx, "update:addon")

    const addon = await ctx.db.get(id)

    if (!addon) {
      throw new ConvexError("Addon not found")
    }

    if (addon.tenantId !== user.tenantId) {
      throw new ConvexError("Forbidden")
    }

    await ctx.db.patch(id, { ...args, updatedAt: Date.now() })
  }
})

export const del = zm({
  args: { id: zid("addons") },
  handler: async (ctx, { id }) => {
    const user = await validateAuth(ctx, "delete:addon")

    const addon = await ctx.db.get(id)

    if (!addon) {
      throw new ConvexError("Addon not found")
    }

    if (addon.tenantId !== user.tenantId) {
      throw new ConvexError("Forbidden")
    }

    await ctx.db.patch(id, { deletedAt: Date.now() })
  }
})

export const list = query({
  handler: async (ctx) => {
    const user = await validateAuth(ctx, "read:addons")

    const addons = await ctx.db
      .query("addons")
      .withIndex("by_tenantId", (q) =>
        q.eq("tenantId", user.tenantId).eq("deletedAt", null)
      )
      .collect()

    return addons
  }
})
