import * as React from "react"
import Fuse from "fuse.js"
import { useEventFiltersStore } from "@/stores/use-event-filters"
import type { EventWithVenue } from "@/stores/use-event-modal"

export function useFilteredEvents(events: EventWithVenue[]) {
  const search = useEventFiltersStore((s) => s.search)
  const venueIds = useEventFiltersStore((s) => s.venueIds)
  const eventStatus = useEventFiltersStore((s) => s.eventStatus)
  const foodService = useEventFiltersStore((s) => s.foodService)

  // Configure Fuse.js for fuzzy search
  const fuse = React.useMemo(() => {
    return new Fuse(events, {
      keys: [
        { name: "title", weight: 2 },
        { name: "customerName", weight: 1.5 },
        { name: "customerEmail", weight: 1 },
        { name: "customerPhone", weight: 1 },
        { name: "venue.name", weight: 1.5 },
        { name: "venue.location", weight: 0.5 },
        { name: "notes", weight: 0.5 }
      ],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 2
    })
  }, [events])

  // Apply all filters
  const filteredEvents = React.useMemo(() => {
    let result = events

    // Apply fuzzy search
    if (search.trim()) {
      const searchResults = fuse.search(search)
      result = searchResults.map((r) => r.item)
    }

    // Apply venue filter
    if (venueIds.length > 0) {
      result = result.filter((event) => venueIds.includes(event.venueId))
    }

    // Apply event status filter
    if (eventStatus !== "all") {
      result = result.filter((event) => event.status === eventStatus)
    }

    // Apply food service filter
    if (foodService !== "all") {
      result = result.filter((event) =>
        foodService === "with" ? event.withFood : !event.withFood
      )
    }

    return result
  }, [events, search, venueIds, eventStatus, foodService, fuse])

  return {
    filteredEvents,
    totalCount: events.length,
    filteredCount: filteredEvents.length,
    hasActiveFilters:
      search.trim() !== "" ||
      venueIds.length > 0 ||
      eventStatus !== "all" ||
      foodService !== "all"
  }
}
