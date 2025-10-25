import { useMemo } from "react"
import { add, format } from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCurrentMonth } from "@/hooks/use-current-month"
import { ButtonGroup } from "@/components/ui/button-group"
import { useEventModal } from "@/stores/use-event-modal"
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

  return (
    <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center justify-between gap-6 md:justify-normal">
        <ButtonGroup className="divide-x divide-background">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon-sm"
                onClick={() => setCurrentMonth(prevMonth)}
              >
                <ChevronLeftIcon />
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
                <ChevronRightIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Next Month ({format(nextMonth, "MMMM")})
            </TooltipContent>
          </Tooltip>
        </ButtonGroup>

        <h2 className="text-lg font-semibold text-foreground">
          {format(currentMonth, "MMMM, yyyy")}
        </h2>
      </div>

      <Button
        size="sm"
        className="w-full md:w-auto"
        onClick={() => openEventModal(today)}
      >
        <PlusIcon />
        New Event
      </Button>
    </div>
  )
}
