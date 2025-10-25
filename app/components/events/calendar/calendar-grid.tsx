import * as React from "react"
import { eachDayOfInterval, endOfMonth, endOfWeek, startOfWeek } from "date-fns"

import { useCurrentMonth } from "@/hooks/use-current-month"
import { CalendarCell } from "./calendar-cell"

export function CalendarGrid() {
  const { currentMonth } = useCurrentMonth()

  const days = React.useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(currentMonth),
      end: endOfWeek(endOfMonth(currentMonth))
    })
  }, [currentMonth])

  return (
    <div className="grid w-full grid-cols-7 grid-rows-5 border-b [&_div:nth-child(7n)]:border-r-0">
      {days.map((day, dayIdx) => (
        <CalendarCell key={day.toString()} day={day} index={dayIdx} />
      ))}
    </div>
  )
}
