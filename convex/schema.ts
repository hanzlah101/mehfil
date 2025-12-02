import { v } from "convex/values"
import { defineSchema, defineTable } from "convex/server"
import { EVENT_STATUS } from "@/lib/constants"

const mealItemsSchema = v.array(
  v.object({
    name: v.string(),
    unit: v.string(),
    qty: v.number(),
    unitPrice: v.number()
  })
)

const addonFields = v.object({
  name: v.string(),
  unit: v.string(),
  qty: v.number(),
  unitPrice: v.number()
})

export default defineSchema({
  tenants: defineTable({
    name: v.string(),
    mail: v.optional(v.string()),
    managerPhone: v.optional(v.string()),
    complainPhone: v.optional(v.string()),
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
    status: v.union(...EVENT_STATUS.map(v.literal)),
    type: v.string(),
    serialCode: v.string(),
    customerName: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    customerCNIC: v.optional(v.string()),
    guestArrival: v.optional(v.string()),
    pax: v.optional(v.union(v.number(), v.null())),
    amountPaid: v.number(),
    discountedTotal: v.union(v.number(), v.null()),
    withFood: v.boolean(),
    meal: v.optional(
      v.object({
        mealId: v.id("meals"),
        items: mealItemsSchema
      })
    ),
    addons: v.optional(v.array(addonFields)),
    cancellationReason: v.optional(v.string()),
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
    .index("by_tenantId_serialCode", ["tenantId", "serialCode"]),
  meals: defineTable({
    title: v.string(),
    items: mealItemsSchema,
    tenantId: v.id("tenants"),
    updatedAt: v.optional(v.number()),
    deletedAt: v.union(v.null(), v.number())
  }).index("by_tenantId", ["tenantId", "deletedAt"]),
  addons: defineTable({
    ...addonFields.fields,
    tenantId: v.id("tenants"),
    updatedAt: v.optional(v.number()),
    deletedAt: v.union(v.null(), v.number())
  }).index("by_tenantId", ["tenantId", "deletedAt"])
})
