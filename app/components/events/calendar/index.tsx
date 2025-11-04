import { CalendarDays } from "./calendar-days"
import { CalendarGrid } from "./calendar-grid"
import { CalendarHeader } from "./calendar-header"

export function EventCalendar() {
  return (
    <>
      <CalendarHeader />
      <div>
        <CalendarDays />
        <CalendarGrid />
      </div>
    </>
  )
}
