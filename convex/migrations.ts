import { Migrations } from "@convex-dev/migrations"
import { components } from "./_generated/api"
import { internalMutation } from "./_generated/server"
import { internal } from "./_generated/api"
import { SERIAL_CODE_PREFIX } from "@/lib/constants"
import type { DataModel } from "./_generated/dataModel"

export const migrations = new Migrations<DataModel>(components.migrations, {
  internalMutation
})

export const setSerialCodeForExistingEvents = migrations.define({
  table: "events",
  migrateOne: async (ctx, event) => {
    if (event.serialCode) {
      return
    }

    const tenantEvents = await ctx.db
      .query("events")
      .withIndex("by_tenantId", (q) => q.eq("tenantId", event.tenantId))
      .collect()

    const sortedEvents = tenantEvents.sort((a, b) => {
      const timeA = a._creationTime ?? 0
      const timeB = b._creationTime ?? 0
      if (timeA !== timeB) {
        return timeA - timeB
      }
      return a._id.localeCompare(b._id)
    })

    const eventIndex = sortedEvents.findIndex((e) => e._id === event._id)

    if (eventIndex === -1) {
      return { serialCode: `${SERIAL_CODE_PREFIX}001` }
    }

    let serialNumber = 1
    for (let i = 0; i < eventIndex; i++) {
      const prevEvent = sortedEvents[i]
      if (prevEvent.serialCode) {
        const match = prevEvent.serialCode.match(/^[A-Z]{3,5}(\d+)$/)
        if (match) {
          const num = parseInt(match[1], 10)
          if (!isNaN(num) && num >= serialNumber) {
            serialNumber = num + 1
          }
        }
      } else {
        serialNumber++
      }
    }

    return {
      serialCode: `${SERIAL_CODE_PREFIX}${String(serialNumber).padStart(3, "0")}`
    }
  }
})

export const run = migrations.runner()
export const runSerialCode = migrations.runner(
  internal.migrations.setSerialCodeForExistingEvents
)
