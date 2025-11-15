import { parseAsStringEnum, useQueryState } from "nuqs"

export function useCalendarView() {
  const [view, setView] = useQueryState(
    "view",
    parseAsStringEnum(["list", "calendar"]).withDefault("list")
  )

  return { view, setView }
}
