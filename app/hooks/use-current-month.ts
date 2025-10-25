import { useMemo } from "react"
import { startOfMonth, startOfToday } from "date-fns"
import { useQueryState } from "nuqs"
import { monthParser } from "@/lib/month-parser"

export function useCurrentMonth() {
  const today = useMemo(() => startOfToday(), [])

  const [currentMonth, setCurrentMonth] = useQueryState(
    "month",
    monthParser.withDefault(startOfMonth(today))
  )

  return { currentMonth, setCurrentMonth, today }
}
