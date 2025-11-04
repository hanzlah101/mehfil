import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  tenants: defineTable({
    name: v.string(),
    updatedAt: v.optional(v.number())
  }),
  venues: defineTable({
    name: v.string(),
    capacity: v.number(),
    location: v.optional(v.string()),
    tenantId: v.id("tenants"),
    color: v.string(),
    updatedAt: v.optional(v.number()),
    deletedAt: v.union(v.null(), v.number())
  }).index("by_tenantId", ["tenantId", "deletedAt"]),
  events: defineTable({
    title: v.string(),
    notes: v.optional(v.string()),
    bookingDate: v.number(),
    startTime: v.number(),
    endTime: v.number(),
    type: v.union(v.literal("reservation"), v.literal("booking")),
    customerName: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    guestArrival: v.optional(v.string()),
    pax: v.optional(
      v.union(v.object({ from: v.number(), to: v.number() }), v.number())
    ),
    withFood: v.boolean(),
    tenantId: v.id("tenants"),
    venueId: v.id("venues"),
    updatedAt: v.optional(v.number()),
    deletedAt: v.union(v.null(), v.number())
  })
    .index("by_venueId_deletedAt", ["venueId", "deletedAt"])
    .index("by_tenantId", ["tenantId", "deletedAt"])
    .index("by_tenantId_deletedAt_startTime", [
      "tenantId",
      "deletedAt",
      "startTime"
    ])
})
