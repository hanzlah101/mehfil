import { z } from "zod"
import { zid } from "zodvex"
import { zm, getNextSerialCode } from "./util"
import { validateAuth } from "./auth"
import { eventSchema as _eventSchema } from "@/validations/events"
import { ConvexError } from "convex/values"
import { query } from "./_generated/server"
import { v } from "convex/values"
import { atLeastOne } from "@/validations/_utils"
import { asyncMap } from "convex-helpers"

const eventSchema = _eventSchema
  .omit({
    venueId: true,
    bookingDate: true,
    startTime: true,
    endTime: true,
    meal: true
  })
  .safeExtend({
    venueId: zid("venues"),
    bookingDate: z.number(),
    startTime: z.number(),
    endTime: z.number(),
    meal: z
      .discriminatedUnion("type", [
        z.object({
          mealId: zid("meals"),
          type: z.literal("package"),
          pricePerHead: z.number().positive(),
          items: z.array(z.object({ name: z.string().min(1) })).optional()
        }),
        z.object({
          mealId: zid("meals"),
          type: z.literal("items"),
          items: z
            .array(
              z.object({
                name: z.string().min(1),
                unit: z.string().min(1),
                qty: z.number().positive(),
                unitPrice: z.number().nonnegative()
              })
            )
            .min(1)
        })
      ])
      .optional()
  })

export const create = zm({
  args: eventSchema,
  handler: async (ctx, args) => {
    const user = await validateAuth(ctx, "create:event")

    const title = `${args.type} - ${args.customerName}`
    const serialCode = await getNextSerialCode(ctx, user.tenantId)

    await ctx.db.insert("events", {
      ...args,
      title,
      serialCode,
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

    const updatePayload: Record<string, unknown> = { ...args }

    if (args.type !== undefined || args.customerName !== undefined) {
      const newType = args.type !== undefined ? args.type : event.type
      const newCustomerName =
        args.customerName !== undefined ? args.customerName : event.customerName
      updatePayload.title = `${newType} - ${newCustomerName}`
    }

    await ctx.db.patch(id, updatePayload)
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

    // The date parameter is a UTC timestamp for the start of a month (from getMonthStartUTC)
    // Calculate month boundaries in UTC to match frontend
    const dateObj = new Date(date)
    const year = dateObj.getUTCFullYear()
    const month = dateObj.getUTCMonth() // 0-11

    // Create UTC dates for month boundaries
    const startTimestamp = Date.UTC(year, month, 1, 0, 0, 0, 0)
    const endTimestamp = Date.UTC(year, month + 1, 1, 0, 0, 0, 0)

    const events = await ctx.db
      .query("events")
      .withIndex("by_tenantId_deletedAt_startTime", (q) =>
        q
          .eq("tenantId", user.tenantId)
          .eq("deletedAt", null)
          .gte("startTime", startTimestamp)
          .lt("startTime", endTimestamp) // Use < instead of <= for exclusive end boundary
      )
      .collect()

    const eventsWithVenues = await asyncMap(events, async (event) => {
      const venue = await ctx.db.get(event.venueId)
      if (!venue) {
        throw new ConvexError("Venue not found")
      }

      const meal = event.meal ? await ctx.db.get(event.meal.mealId) : null
      if (meal && meal.tenantId !== user.tenantId) {
        throw new ConvexError("Forbidden")
      }

      return { ...event, mealName: meal?.title ?? null, venue }
    })

    return eventsWithVenues
  }
})

export const getById = query({
  args: { id: v.id("events") },
  handler: async (ctx, { id }) => {
    const user = await validateAuth(ctx, "read:events")

    const event = await ctx.db.get(id)

    if (!event) {
      throw new ConvexError("Event not found")
    }

    if (event.tenantId !== user.tenantId) {
      throw new ConvexError("Forbidden")
    }

    const venue = await ctx.db.get(event.venueId)
    if (!venue) {
      throw new ConvexError("Venue not found")
    }

    const meal = event.meal ? await ctx.db.get(event.meal.mealId) : null
    if (meal && meal.tenantId !== user.tenantId) {
      throw new ConvexError("Forbidden")
    }

    return { ...event, mealName: meal?.title ?? null, venue }
  }
})
