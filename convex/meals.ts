import { zid } from "zodvex"
import { zm } from "./util"
import { validateAuth } from "./auth"
import { mealSchema } from "@/validations/meals"
import { ConvexError } from "convex/values"
import { query } from "./_generated/server"
import { atLeastOne } from "@/validations/_utils"

export const create = zm({
  args: mealSchema,
  handler: async (ctx, args) => {
    const user = await validateAuth(ctx, "create:meal")

    await ctx.db.insert("meals", {
      ...args,
      deletedAt: null,
      tenantId: user.tenantId
    })

    return user
  }
})

export const update = zm({
  args: atLeastOne(mealSchema).safeExtend({ id: zid("meals") }),
  handler: async (ctx, { id, ...args }) => {
    const user = await validateAuth(ctx, "update:meal")

    const meal = await ctx.db.get(id)

    if (!meal) {
      throw new ConvexError("Meal not found")
    }

    if (meal.tenantId !== user.tenantId) {
      throw new ConvexError("Forbidden")
    }

    await ctx.db.patch(id, { ...args, updatedAt: Date.now() })
  }
})

export const del = zm({
  args: { id: zid("meals") },
  handler: async (ctx, { id }) => {
    const user = await validateAuth(ctx, "delete:meal")

    const meal = await ctx.db.get(id)

    if (!meal) {
      throw new ConvexError("Meal not found")
    }

    if (meal.tenantId !== user.tenantId) {
      throw new ConvexError("Forbidden")
    }

    await ctx.db.patch(id, { deletedAt: Date.now() })
  }
})

export const list = query({
  handler: async (ctx) => {
    const user = await validateAuth(ctx, "read:meals")

    const meals = await ctx.db
      .query("meals")
      .withIndex("by_tenantId", (q) =>
        q.eq("tenantId", user.tenantId).eq("deletedAt", null)
      )
      .collect()

    return meals
  }
})
