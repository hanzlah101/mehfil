import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { convexQuery } from "@convex-dev/react-query"
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfWeek,
  isSameDay
} from "date-fns"

import { cn } from "@/lib/utils"
import { useCurrentMonth } from "@/hooks/use-current-month"
import { CalendarCell } from "@/components/events/calendar/calendar-cell"
import { api } from "@db/_generated/api"

export function CalendarGrid() {
  const { currentMonth } = useCurrentMonth()

  const { data } = useQuery(
    convexQuery(api.events.list, { date: currentMonth.getTime() })
  )

  const getEventsByDate = React.useCallback(
    (date: Date) => {
      return data?.filter((event) => isSameDay(event.startTime, date)) ?? []
    },
    [data]
  )

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
        <CalendarCell
          key={day.toString()}
          day={day}
          index={dayIdx}
          events={getEventsByDate(day)}
        />
      ))}
    </div>
  )
}
