import { ConvexError } from "convex/values"
import { query } from "./_generated/server"
import { validateAuth } from "./auth"

export const get = query({
  handler: async (ctx) => {
    const user = await validateAuth(ctx)

    if (!user.tenantId) {
      throw new ConvexError("Unauthorized")
    }

    const tenantId = ctx.db.normalizeId("tenants", user.tenantId)

    if (!tenantId) {
      throw new ConvexError("Unauthorized")
    }

    const tenant = await ctx.db.get(tenantId)

    if (!tenant) {
      throw new ConvexError("Unauthorized")
    }

    return tenant
  }
})
