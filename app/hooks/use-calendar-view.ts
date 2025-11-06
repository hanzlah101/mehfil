import { parseAsStringEnum, useQueryState } from "nuqs"

export function useCalendarView() {
  const [view, setView] = useQueryState(
    "view",
    parseAsStringEnum(["calendar", "list"]).withDefault("calendar")
  )

  return { view, setView }
}
