import { CalendarDays } from "./calendar-days"
import { CalendarGrid } from "./calendar-grid"
import { CalendarHeader } from "./calendar-header"

/**
 * Renders an event calendar composed of a header, weekday labels, and a grid view.
 *
 * @returns The calendar JSX element containing the header, weekday labels, and grid.
 */
export function EventCalendar() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <CalendarHeader />
      <div className="lg:flex lg:flex-auto lg:flex-col">
        <CalendarDays />
        <CalendarGrid />
      </div>
    </div>
  )
}