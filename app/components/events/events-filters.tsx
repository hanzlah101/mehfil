import * as React from "react"
import { RiFilterFill, RiCloseLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { useEventFiltersStore } from "@/stores/use-event-filters"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"

import { EventsSearch } from "./events-search"
import { EventsVenueFilter } from "./events-venue-filter"
import { EventsTypeFilter } from "./events-type-filter"
import { EventsWithFoodFilter } from "./events-with-food-filter"

export function EventsFilters() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible className="space-y-3" open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-2">
        <EventsSearch />
        <FiltersTrigger />
      </div>

      <CollapsibleContent>
        <div className="mt-3 space-y-4 rounded-lg border bg-card p-4">
          <EventsVenueFilter />
          <EventsTypeFilter />
          <EventsWithFoodFilter />
          <ClearFilters />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function useActiveFiltersCount() {
  const venueIds = useEventFiltersStore((s) => s.venueIds)
  const eventType = useEventFiltersStore((s) => s.eventType)
  const foodService = useEventFiltersStore((s) => s.foodService)

  const activeFiltersCount = [
    venueIds.length > 0,
    eventType !== "all",
    foodService !== "all"
  ].filter(Boolean).length

  return activeFiltersCount
}

function FiltersTrigger() {
  const activeFiltersCount = useActiveFiltersCount()

  return (
    <CollapsibleTrigger asChild>
      <Button variant="outline" className="ml-auto shrink-0">
        <RiFilterFill className="text-muted-foreground" />
        <span className="hidden sm:inline">Filters</span>
        {activeFiltersCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {activeFiltersCount}
          </span>
        )}
      </Button>
    </CollapsibleTrigger>
  )
}

function ClearFilters() {
  const activeFiltersCount = useActiveFiltersCount()
  const clearFilters = useEventFiltersStore((s) => s.clear)

  if (!activeFiltersCount) return null

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={clearFilters}
      className="w-full"
    >
      <RiCloseLine />
      Clear Filters
    </Button>
  )
}
