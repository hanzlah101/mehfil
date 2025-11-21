import { Migrations } from "@convex-dev/migrations"
import { components, internal } from "./_generated/api.js"
import type { DataModel } from "./_generated/dataModel.js"

// Initialize the migrations component
export const migrations = new Migrations<DataModel>(components.migrations)

// Export runner for running migrations
export const run = migrations.runner()

// Individual migration runners
export const runRemoveChargesFromVenues = migrations.runner(
  internal.migrations.removeChargesFromVenues
)

export const runRemoveHallChargesFromEvents = migrations.runner(
  internal.migrations.removeHallChargesFromEvents
)

/**
 * Migration 1: Remove charges field from venues table
 *
 * This migration removes the `charges` field from all venue documents.
 * Using shorthand syntax - returning an object will automatically patch the document.
 */
export const removeChargesFromVenues = migrations.define({
  table: "venues",
  migrateOne: async (ctx, venue) => {
    // Check if venue has charges field (using type assertion for old data)
    const venueWithCharges = venue as typeof venue & { charges?: number }

    if (
      "charges" in venueWithCharges &&
      venueWithCharges.charges !== undefined
    ) {
      // Shorthand: returning an object automatically patches the document
      return {
        charges: undefined,
        updatedAt: Date.now()
      }
    }
  }
})

/**
 * Migration 2: Remove hallCharges field from events table
 *
 * This migration removes the `hallCharges` field from all event documents.
 * Using shorthand syntax - returning an object will automatically patch the document.
 */
export const removeHallChargesFromEvents = migrations.define({
  table: "events",
  migrateOne: async (ctx, event) => {
    // Check if event has hallCharges field (using type assertion for old data)
    const eventWithHallCharges = event as typeof event & {
      hallCharges?: number
    }

    if (
      "hallCharges" in eventWithHallCharges &&
      eventWithHallCharges.hallCharges !== undefined
    ) {
      // Shorthand: returning an object automatically patches the document
      return {
        hallCharges: undefined,
        updatedAt: Date.now()
      }
    }
  }
})

/**
 * Run both migrations in sequence
 *
 * Usage:
 *   npx convex run migrations:runAll
 *
 * Or run individually:
 *   npx convex run migrations:runRemoveChargesFromVenues
 *   npx convex run migrations:runRemoveHallChargesFromEvents
 *
 * Or use the general runner:
 *   npx convex run migrations:run '{fn: "migrations:removeChargesFromVenues"}'
 *   npx convex run migrations:run '{fn: "migrations:removeHallChargesFromEvents"}'
 */
export const runAll = migrations.runner([
  internal.migrations.removeChargesFromVenues,
  internal.migrations.removeHallChargesFromEvents
])
