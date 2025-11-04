import { zid } from "zodvex"
import { zm } from "./util"
import { validateAuth } from "./auth"
import { venueSchema } from "@/validations/venue"
import { ConvexError } from "convex/values"
import { query } from "./_generated/server"
import { atLeastOne } from "@/validations/_utils"

export const create = zm({
  args: venueSchema,
  handler: async (ctx, args) => {
    const user = await validateAuth(ctx, "create:venue")

    await ctx.db.insert("venues", {
      ...args,
      deletedAt: null,
      tenantId: user.tenantId
    })

    return user
  }
})

export const update = zm({
  args: atLeastOne(venueSchema).safeExtend({ id: zid("venues") }),
  handler: async (ctx, { id, ...args }) => {
    const user = await validateAuth(ctx, "update:venue")

    const venue = await ctx.db.get(id)

    if (!venue) {
      throw new ConvexError("Venue not found")
    }

    if (venue.tenantId !== user.tenantId) {
      throw new ConvexError("Forbidden")
    }

    await ctx.db.patch(id, { ...args, updatedAt: Date.now() })
  }
})

export const del = zm({
  args: { id: zid("venues") },
  handler: async (ctx, { id }) => {
    const user = await validateAuth(ctx, "delete:venue")

    const venue = await ctx.db.get(id)

    if (!venue) {
      throw new ConvexError("Venue not found")
    }

    if (venue.tenantId !== user.tenantId) {
      throw new ConvexError("Forbidden")
    }

    const hasEvents = await ctx.db
      .query("events")
      .withIndex("by_venueId_deletedAt", (q) =>
        q.eq("venueId", id).eq("deletedAt", null)
      )
      .first()

    if (hasEvents) {
      throw new ConvexError(
        "Deletion blocked: venue has linked events. Remove all associated events first."
      )
    }

    await ctx.db.patch(id, { deletedAt: Date.now() })
  }
})

export const list = query({
  handler: async (ctx) => {
    const user = await validateAuth(ctx, "read:venues")

    const venues = await ctx.db
      .query("venues")
      .withIndex("by_tenantId", (q) =>
        q.eq("tenantId", user.tenantId).eq("deletedAt", null)
      )
      .collect()

    return venues
  }
})
