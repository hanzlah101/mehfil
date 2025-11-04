import * as React from "react"
import { eachDayOfInterval, endOfMonth, endOfWeek, startOfWeek } from "date-fns"

import { cn } from "@/lib/utils"
import { useCurrentMonth } from "@/hooks/use-current-month"
import { CalendarCell } from "@/components/events/calendar/calendar-cell"

export function CalendarGrid() {
  const { currentMonth } = useCurrentMonth()

  const days = React.useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(currentMonth),
      end: endOfWeek(endOfMonth(currentMonth))
    })
  }, [currentMonth])

  const rows = Math.ceil(days.length / 7) // 5 or 6

  return (
    <div
      className={cn(
        "grid w-full grid-cols-7 border-b border-l",
        rows === 6 ? "grid-rows-6" : "grid-rows-5"
      )}
    >
      {days.map((day, dayIdx) => (
        <CalendarCell key={day.toString()} day={day} index={dayIdx} />
      ))}
    </div>
  )
}
