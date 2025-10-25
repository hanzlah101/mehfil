import * as React from "react"
import { format, getDay, isSameDay, isSameMonth, isToday } from "date-fns"

import { cn } from "@/lib/utils"
import { useCurrentMonth } from "@/hooks/use-current-month"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { VENUE_COLORS, getEventColorClasses } from "@/lib/constants"
import type { Doc, Id } from "@db/_generated/dataModel"

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

const venues: (Doc<"venues"> & { _id: Id<"venues"> })[] = Array.from({
  length: 15
}).map((_, i) => ({
  _id: `venue_${i}` as Id<"venues">,
  _creationTime: Date.now(),
  name: `Venue ${i + 1}`,
  location: `Location ${i + 1}`,
  capacity: 50 + i * 10,
  tenantId: "tenant_001" as Id<"tenants">,
  color: VENUE_COLORS[i % VENUE_COLORS.length],
  updatedAt: Date.now()
}))

// helper to generate random date/time in a given range
const randomDateInRange = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))

// helper to generate random event duration (1–4 hours)
const randomDurationHours = () => Math.floor(Math.random() * 4) + 1

// events with random booking/start/end time
const data = Array.from({ length: 15 }).map((_, i) => {
  const venue = venues[i % venues.length]

  // booking date within next 30 days
  const bookingDate = randomDateInRange(
    new Date("2025-10-25T00:00:00Z"),
    new Date("2025-11-25T00:00:00Z")
  )

  // random start time between 10 AM and 8 PM
  const start = new Date(bookingDate)
  start.setHours(10 + Math.floor(Math.random() * 10), 0, 0, 0)

  // random duration (1–4 hours)
  const duration = randomDurationHours()
  const end = new Date(start)
  end.setHours(start.getHours() + duration)

  return {
    _id: `event_${i}` as Id<"events">,
    _creationTime: Date.now(),
    title: `Corporate Dinner ${i + 1}`,
    notes: "Client requested vegetarian options only",
    bookingDate: bookingDate.getTime(),
    startTime: start.getTime(),
    endTime: end.getTime(),
    type: Math.random() > 0.5 ? "booking" : "reservation",
    customerName: `John Doe ${i + 1}`,
    customerEmail: `john.doe${i + 1}@example.com`,
    customerPhone: `+1-555-123-45${(i + 10).toString().padStart(2, "0")}`,
    customerLocation: `Downtown Plaza ${i + 1}`,
    pax:
      Math.random() > 0.5 ? [5, 10, 15] : Math.floor(Math.random() * 50) + 10,
    withFood: Math.random() > 0.3,
    tenantId: "tenant_001" as Id<"tenants">,
    venueId: venue._id,
    updatedAt: Date.now(),
    venue
  }
}) satisfies (Doc<"events"> & { venue: Doc<"venues"> })[]

/**
 * Render a calendar day cell that displays the date and any events for that day.
 *
 * Filters events whose `startTime` falls on `day`, highlights today, and visually mutes days
 * outside the current month. On desktop it shows up to `MAX_EVENTS` event bars with venue
 * colors and a "+N more" indicator when there are additional events; on mobile it shows a
 * compact event count. Clicking the cell triggers a date alert.
 *
 * @param day - The date represented by this cell.
 * @param index - The zero-based index of the day within the calendar grid (used for column-start alignment).
 * @returns A JSX element for the calendar cell containing the day button and the day's events or placeholders.
 */
export function CalendarCell({ day, index }: { day: Date; index: number }) {
  const isMobile = useIsMobile()
  const { currentMonth } = useCurrentMonth()

  const today = isToday(day)
  const isSame = isSameMonth(day, currentMonth)

  const filteredEvents = React.useMemo(() => {
    return data.filter((evt) => isSameDay(evt.startTime, day))
  }, [data])

  return (
    <div
      key={index}
      onClick={() => alert(day)}
      className={cn(
        index === 0 && colStartClasses[getDay(day)],
        "relative flex cursor-pointer flex-col border-t border-r px-0.5 py-2 hover:bg-muted focus:z-10 dark:hover:bg-muted/50",
        !isSame && "bg-muted/50 text-muted-foreground dark:bg-accent/30"
      )}
    >
      <Button
        type="button"
        size="icon"
        variant={today ? "default" : "ghost"}
        className={cn(
          "mx-auto flex size-6 shrink-0 items-center justify-center rounded-full text-xs md:mx-0",
          !today && !isSame && "text-muted-foreground"
        )}
      >
        <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
      </Button>

      {filteredEvents.length > 0 ? (
        <div className="space-y-1.5 p-1">
          {!isMobile &&
            filteredEvents.slice(0, MAX_EVENTS).map((event) => (
              <div
                key={event._id}
                className={cn(
                  "w-full space-y-1 rounded-sm px-2 py-1.5 leading-tight",
                  getEventColorClasses(event.venue.color)
                )}
              >
                <p className="truncate text-xs leading-none font-medium">
                  {event.title}
                </p>
              </div>
            ))}

          {isMobile ? (
            <p className="font-mono text-[9px] leading-none text-muted-foreground text-center">
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1 ? "event" : "events"}
            </p>
          ) : (
            filteredEvents.length > MAX_EVENTS && (
              <p className="font-mono leading-none text-muted-foreground text-xs">
                +{filteredEvents.length - MAX_EVENTS} more
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

/**
 * Renders placeholder rows for a calendar cell when there are no events.
 *
 * Displays up to `MAX_EVENTS` empty placeholder lines on non-mobile screens and a single compact line on mobile.
 *
 * @returns A JSX element containing the placeholder layout for empty event slots.
 */
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