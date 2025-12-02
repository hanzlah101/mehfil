import { zQueryBuilder, zMutationBuilder, zActionBuilder } from "zodvex"
import { query, mutation, action } from "./_generated/server"
import { SERIAL_CODE_PREFIX } from "@/lib/constants"
import type { MutationCtx } from "./_generated/server"
import type { Id } from "./_generated/dataModel"
import {
  query as authQuery,
  mutation as authMutation,
  action as authAction
} from "./auth/_generated/server"

export const zq = zQueryBuilder(query)
export const zm = zMutationBuilder(mutation)
export const za = zActionBuilder(action)

export const authZQ = zQueryBuilder(authQuery)
export const authZM = zMutationBuilder(authMutation)
export const authZA = zActionBuilder(authAction)

export async function getNextSerialCode(
  ctx: MutationCtx,
  tenantId: Id<"tenants">
) {
  const allEvents = await ctx.db
    .query("events")
    .withIndex("by_tenantId_serialCode", (q) => q.eq("tenantId", tenantId))
    .collect()

  let maxNumber = 0
  for (const event of allEvents) {
    if (!event.serialCode) continue

    const match = event.serialCode.match(/^[A-Z]{3,5}(\d+)$/)
    if (match) {
      const num = parseInt(match[1], 10)
      if (!isNaN(num) && num > maxNumber) {
        maxNumber = num
      }
    }
  }

  const nextNumber = maxNumber + 1
  return `${SERIAL_CODE_PREFIX}${String(nextNumber).padStart(3, "0")}`
}
