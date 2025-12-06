import { z } from "zod"
import { zid } from "zodvex"
import { zm } from "./util"
import { validateAuth } from "./auth"
import { mealSchema } from "@/validations/meals"
import { ConvexError } from "convex/values"
import { query } from "./_generated/server"

export const create = zm({
  args: mealSchema,
  handler: async (ctx, { value: args }) => {
    const user = await validateAuth(ctx, "create:meal")

    await ctx.db.insert("meals", {
      type: args.type,
      title: args.title,
      pricePerHead: args.type === "package" ? args.pricePerHead : undefined,
      items: args.type === "package" ? (args.items ?? []) : args.items,
      deletedAt: null,
      tenantId: user.tenantId
    })
  }
})

const updateMealSchema = z.object({ id: zid("meals") }).and(mealSchema)

export const update = zm({
  args: updateMealSchema,
  handler: async (ctx, args) => {
    const user = await validateAuth(ctx, "update:meal")

    const meal = await ctx.db.get(args.value.id)

    if (!meal) {
      throw new ConvexError("Meal not found")
    }

    if (meal.tenantId !== user.tenantId) {
      throw new ConvexError("Forbidden")
    }

    await ctx.db.patch(args.value.id, {
      ...args,
      updatedAt: Date.now()
    })
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
