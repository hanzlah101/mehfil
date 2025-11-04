import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { RiCalendar2Fill } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FieldControl } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"

export function DatePicker({
  value,
  onChange,
  disabled
}: {
  value?: Date
  onChange: (val?: Date) => void
  disabled: boolean
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FieldControl>
          <Button
            variant={"outline"}
            disabled={disabled}
            className={cn(
              "w-full pl-3 text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            {value ? format(value, "PPP") : <span>Pick a date</span>}
            <RiCalendar2Fill className="ml-auto opacity-50" />
          </Button>
        </FieldControl>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          disabled={disabled}
          selected={value}
          defaultMonth={value}
          onSelect={onChange}
          captionLayout="dropdown"
          startMonth={new Date(2020, 0)}
          endMonth={new Date(2030, 11)}
        />
      </PopoverContent>
    </Popover>
  )
}
