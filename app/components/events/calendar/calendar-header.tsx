import { useMemo } from "react"
import { add, format } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { convexQuery } from "@convex-dev/react-query"
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiAddLine
} from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { useCurrentMonth } from "@/hooks/use-current-month"
import { ButtonGroup } from "@/components/ui/button-group"
import { useEventModal } from "@/stores/use-event-modal"
import { CalendarViews } from "@/components/events/calendar/calendar-views"
import { api } from "@db/_generated/api"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"

export function CalendarHeader() {
  const openEventModal = useEventModal((s) => s.onOpen)
  const { currentMonth, setCurrentMonth, today } = useCurrentMonth()

  const { nextMonth, prevMonth } = useMemo(
    () => ({
      nextMonth: add(currentMonth, { months: 1 }),
      prevMonth: add(currentMonth, { months: -1 })
    }),
    [currentMonth]
  )

  const { data: events } = useQuery(
    convexQuery(api.events.list, {
      date: currentMonth.getTime()
    })
  )

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-6 not-md:flex-row-reverse not-md:justify-between">
        <ButtonGroup className="divide-x divide-background">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon-sm"
                onClick={() => setCurrentMonth(prevMonth)}
              >
                <RiArrowLeftSLine />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Previous Month ({format(prevMonth, "MMMM")})
            </TooltipContent>
          </Tooltip>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setCurrentMonth(null)}
          >
            Today
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon-sm"
                onClick={() => setCurrentMonth(nextMonth)}
              >
                <RiArrowRightSLine />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Next Month ({format(nextMonth, "MMMM")})
            </TooltipContent>
          </Tooltip>
        </ButtonGroup>

        <h2 className="text-lg font-semibold text-foreground">
          {format(currentMonth, "MMMM, yyyy")}{" "}
          {events && events.length > 0 && (
            <span className="font-mono text-xs font-medium">
              ({events.length} {events.length === 1 ? "Event" : "Events"})
            </span>
          )}
        </h2>
      </div>

      <div className="flex gap-6 not-md:flex-col md:items-center">
        <CalendarViews />
        <Button
          size="sm"
          className="w-full md:w-auto"
          onClick={() => openEventModal("create", today)}
        >
          <RiAddLine />
          New Event
        </Button>
      </div>
    </div>
  )
}
