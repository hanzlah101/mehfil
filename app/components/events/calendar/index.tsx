import { useCalendarView } from "@/hooks/use-calendar-view"
import { EventsList } from "@/components/events/events-list"
import { CalendarDays } from "./calendar-days"
import { CalendarGrid } from "./calendar-grid"
import { CalendarHeader } from "./calendar-header"

export function EventCalendar() {
  const { view } = useCalendarView()

  return (
    <>
      <CalendarHeader />
      {view === "list" ? (
        <EventsList />
      ) : (
        <div>
          <CalendarDays />
          <CalendarGrid />
        </div>
      )}
    </>
  )
}
