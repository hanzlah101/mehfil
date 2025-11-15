import { zid } from "zodvex"
import { zm } from "./util"
import { validateAuth } from "./auth"
import { eventSchema as _eventSchema } from "@/validations/events"
import { ConvexError } from "convex/values"
import { query } from "./_generated/server"
import { v } from "convex/values"
import { z } from "zod"
import { atLeastOne } from "@/validations/_utils"
import { asyncMap } from "convex-helpers"

const eventSchema = _eventSchema
  .omit({
    venueId: true,
    bookingDate: true,
    startTime: true,
    endTime: true
  })
  .safeExtend({
    venueId: zid("venues"),
    bookingDate: z.number(),
    startTime: z.number(),
    endTime: z.number()
  })

export const create = zm({
  args: eventSchema,
  handler: async (ctx, args) => {
    const user = await validateAuth(ctx, "create:event")

    await ctx.db.insert("events", {
      ...args,
      deletedAt: null,
      tenantId: user.tenantId
    })

    return user
  }
})

export const update = zm({
  args: atLeastOne(eventSchema).safeExtend({ id: zid("events") }),
  handler: async (ctx, { id, ...args }) => {
    const user = await validateAuth(ctx, "update:event")

    const event = await ctx.db.get(id)

    if (!event) {
      throw new ConvexError("Event not found")
    }

    if (event.tenantId !== user.tenantId) {
      throw new ConvexError("Forbidden")
    }

    await ctx.db.patch(id, args)
  }
})

export const del = zm({
  args: { id: zid("events") },
  handler: async (ctx, { id }) => {
    const user = await validateAuth(ctx, "delete:event")

    const event = await ctx.db.get(id)

    if (!event) {
      throw new ConvexError("Event not found")
    }

    if (event.tenantId !== user.tenantId) {
      throw new ConvexError("Forbidden")
    }

    await ctx.db.patch(id, { deletedAt: Date.now() })
  }
})

export const list = query({
  args: { date: v.number() },
  handler: async (ctx, { date }) => {
    const user = await validateAuth(ctx, "read:events")

    const startOfMonth = new Date(date)
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const endOfMonth = new Date(date)
    endOfMonth.setMonth(endOfMonth.getMonth() + 1)
    endOfMonth.setDate(0)
    endOfMonth.setHours(23, 59, 59, 999)

    const events = await ctx.db
      .query("events")
      .withIndex("by_tenantId_deletedAt_startTime", (q) =>
        q
          .eq("tenantId", user.tenantId)
          .eq("deletedAt", null)
          .gte("startTime", startOfMonth.getTime())
          .lte("startTime", endOfMonth.getTime())
      )
      .collect()

    const eventsWithVenues = await asyncMap(events, async (event) => {
      const venue = await ctx.db.get(event.venueId)
      const meal = event.meal ? await ctx.db.get(event.meal.mealId) : null
      if (!venue) {
        throw new ConvexError("Venue not found")
      }
      return { ...event, mealName: meal?.title ?? null, venue }
    })

    return eventsWithVenues
  }
})
