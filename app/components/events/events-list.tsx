import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { RiCalendar2Fill } from "@remixicon/react"

import { api } from "@db/_generated/api"
import { useCurrentMonth } from "@/hooks/use-current-month"
import { Button } from "@/components/ui/button"
import { convexQuery } from "@convex-dev/react-query"
import { EventsFilters } from "@/components/events/events-filters"
import { useFilteredEvents } from "@/hooks/use-filtered-events"
import { EventListItem } from "./event-list-item"
import { useEventModal } from "@/stores/use-event-modal"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty"

export function EventsList() {
  const { currentMonth } = useCurrentMonth()
  const openEventModal = useEventModal((s) => s.onOpen)
  const { data: events, isLoading } = useQuery(
    convexQuery(api.events.list, {
      date: currentMonth.getTime()
    })
  )

  const sortedEvents = React.useMemo(() => {
    if (!events) return []
    return [...events].sort((a, b) => a.startTime - b.startTime)
  }, [events])

  const { filteredEvents, filteredCount, totalCount, hasActiveFilters } =
    useFilteredEvents(sortedEvents)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <EventListItem.Skeleton key={i} />
        ))}
      </div>
    )
  }

  if (!events || events.length === 0) {
    return (
      <Empty className="h-[calc(100%-32px)]">
        <EmptyHeader className="max-w-md">
          <EmptyMedia variant="icon">
            <RiCalendar2Fill className="text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>No events found</EmptyTitle>
          <EmptyDescription>
            There are no events scheduled for{" "}
            <span className="whitespace-nowrap text-foreground">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            . To add one, simply click the button below.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <Button
            className="mx-auto"
            onClick={() => openEventModal("create", currentMonth)}
          >
            Create new event
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      <EventsFilters />
      {hasActiveFilters && filteredEvents.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalCount} events
        </div>
      )}

      {filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-30 text-center">
          <RiCalendar2Fill className="size-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">
            No events match your filters
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <EventListItem key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
