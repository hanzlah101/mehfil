import { RiCalendar2Fill, RiListUnordered } from "@remixicon/react"
import { useCalendarView } from "@/hooks/use-calendar-view"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"

export function CalendarViews() {
  const { view, setView } = useCalendarView()

  return (
    <ToggleGroup
      variant="outline"
      type="single"
      value={view}
      className="not-md:w-full"
      onValueChange={(v) => (v ? setView(v as typeof view) : {})}
    >
      <Tooltip>
        <ToggleGroupItem asChild value="list" className="not-md:w-1/2">
          <TooltipTrigger>
            <RiListUnordered className="text-muted-foreground" />
          </TooltipTrigger>
        </ToggleGroupItem>
        <TooltipContent>List View</TooltipContent>
      </Tooltip>

      <Tooltip>
        <ToggleGroupItem asChild value="calendar" className="not-md:w-1/2">
          <TooltipTrigger>
            <RiCalendar2Fill className="text-muted-foreground" />
          </TooltipTrigger>
        </ToggleGroupItem>
        <TooltipContent>Calendar View</TooltipContent>
      </Tooltip>
    </ToggleGroup>
  )
}
