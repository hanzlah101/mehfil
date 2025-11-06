import * as React from "react"
import { RiFilterFill } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { useEventFiltersStore } from "@/stores/use-event-filters"
import { Separator } from "@/components/ui/separator"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"

import { useIsMobile } from "@/hooks/use-mobile"
import { EventsSearch } from "./events-search"
import { EventsVenueFilter } from "./events-venue-filter"
import { EventsTypeFilter } from "./events-type-filter"
import { EventsWithFoodFilter } from "./events-with-food-filter"

export function EventsFilters() {
  const [isOpen, setIsOpen] = React.useState(false)
  const initializePending = useEventFiltersStore((s) => s.initializePending)
  const isMobile = useIsMobile()

  function handleOpenChange(open: boolean) {
    if (open) initializePending()
    setIsOpen(open)
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={handleOpenChange}
      direction={isMobile ? "bottom" : "right"}
    >
      <div className="flex items-center gap-2">
        <EventsSearch />
        <FiltersTrigger />
      </div>

      <DrawerContent className="md:data-[vaul-drawer-direction=right]:max-w-lg">
        <DrawerHeader className="border-b md:pt-4">
          <DrawerTitle>Filter Events</DrawerTitle>
          <DrawerDescription>
            Refine your event search with filters below
          </DrawerDescription>
        </DrawerHeader>

        <div className="h-full flex-1 space-y-6 overflow-y-auto px-4 py-4">
          <EventsVenueFilter />
          <Separator />
          <EventsTypeFilter />
          <Separator />
          <EventsWithFoodFilter />
        </div>

        <FiltersFooter onClose={() => setIsOpen(false)} />
      </DrawerContent>
    </Drawer>
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
    <DrawerTrigger asChild>
      <Button variant="outline" className="ml-auto shrink-0">
        <RiFilterFill className="text-muted-foreground" />
        <span className="hidden sm:inline">Filters</span>
        {activeFiltersCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {activeFiltersCount}
          </span>
        )}
      </Button>
    </DrawerTrigger>
  )
}

function FiltersFooter({ onClose }: { onClose: () => void }) {
  const activeFiltersCount = useActiveFiltersCount()
  const clearFilters = useEventFiltersStore((s) => s.clear)
  const applyFilters = useEventFiltersStore((s) => s.applyFilters)

  function handleClearFilters() {
    clearFilters()
    onClose()
  }

  function handleApplyFilters() {
    applyFilters()
    onClose()
  }

  return (
    <DrawerFooter className="mt-auto border-t">
      <Button variant="default" className="w-full" onClick={handleApplyFilters}>
        Apply Filters
      </Button>
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="w-full"
        >
          Clear All Filters ({activeFiltersCount})
        </Button>
      )}
    </DrawerFooter>
  )
}
