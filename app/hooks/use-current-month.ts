import { useMemo } from "react"
import { startOfMonth, startOfToday } from "date-fns"
import { useQueryState } from "nuqs"
import { monthParser } from "@/lib/month-parser"

/**
 * Provides the current month stored in query state along with an updater and today's date (start of day).
 *
 * @returns An object containing:
 * - `currentMonth` — the month value stored under the "month" query parameter (parsed via `monthParser`).
 * - `setCurrentMonth` — function to update the `currentMonth` query state.
 * - `today` — a `Date` representing the start of the current day.
 */
export function useCurrentMonth() {
  const today = useMemo(() => startOfToday(), [])

  const [currentMonth, setCurrentMonth] = useQueryState(
    "month",
    monthParser.withDefault(startOfMonth(today))
  )

  return { currentMonth, setCurrentMonth, today }
}