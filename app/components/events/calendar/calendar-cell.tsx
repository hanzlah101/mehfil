import { format, getDay, isSameMonth, isToday } from "date-fns"

import { cn } from "@/lib/utils"
import { useCurrentMonth } from "@/hooks/use-current-month"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { useEventModal } from "@/stores/use-event-modal"
import { EVENT_COLOR_CLASSES, getEventColorStyles } from "@/lib/colors"
import type { Doc } from "@db/_generated/dataModel"

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7"
]

const MAX_EVENTS = 3

export function CalendarCell({
  day,
  index,
  events
}: {
  day: Date
  index: number
  events: (Doc<"events"> & { venue: Doc<"venues"> })[]
}) {
  const isMobile = useIsMobile()
  const { currentMonth } = useCurrentMonth()

  const today = isToday(day)
  const isSame = isSameMonth(day, currentMonth)
  const openEventModal = useEventModal((s) => s.onOpen)

  return (
    <div
      key={index}
      onClick={() => openEventModal("create", day)}
      className={cn(
        index === 0 && colStartClasses[getDay(day)],
        "relative flex flex-col border-t border-r px-0.5 py-2 transition-colors hover:bg-muted focus:z-10 md:px-2 dark:hover:bg-muted/50",
        !isSame && "bg-muted/50 text-muted-foreground dark:bg-accent/30"
      )}
    >
      <Button
        type="button"
        size="icon"
        variant={today ? "default" : "ghost"}
        aria-current={today ? "date" : undefined}
        className={cn(
          "mx-auto flex size-6 shrink-0 items-center justify-center rounded-full text-xs md:mx-0",
          !today && !isSame && "text-muted-foreground"
        )}
      >
        <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
      </Button>

      {events.length > 0 ? (
        <div className="space-y-1.5 p-1">
          {!isMobile &&
            events.slice(0, MAX_EVENTS).map((event) => (
              <button
                key={event._id}
                style={getEventColorStyles(event.venue.color)}
                onClick={(evt) => {
                  evt.stopPropagation()
                  evt.preventDefault()
                  openEventModal("update", event)
                }}
                className={cn(
                  "w-full space-y-1 rounded-sm px-2 py-1.5 leading-tight transition-all",
                  EVENT_COLOR_CLASSES
                )}
              >
                <p className="truncate text-xs leading-none font-medium">
                  {event.title}
                </p>
              </button>
            ))}

          {isMobile ? (
            <p className="text-center font-mono text-[9px] leading-none text-muted-foreground">
              {events.length} {events.length === 1 ? "event" : "events"}
            </p>
          ) : (
            events.length > MAX_EVENTS && (
              <p className="font-mono text-xs leading-none text-muted-foreground">
                +{events.length - MAX_EVENTS} more
              </p>
            )
          )}
        </div>
      ) : (
        <EmptyEvents />
      )}
    </div>
  )
}

function EmptyEvents() {
  const isMobile = useIsMobile()

  return (
    <div className="space-y-1.5 select-none">
      {!isMobile &&
        Array.from({ length: MAX_EVENTS }).map((_, idx) => (
          <div
            key={idx}
            className="w-full items-start space-y-1 rounded-sm px-2 py-1.5 leading-tight"
          >
            <p className="truncate text-xs leading-none font-medium">&nbsp;</p>
          </div>
        ))}

      <p className="text-xs text-muted-foreground">&nbsp;</p>
    </div>
  )
}
