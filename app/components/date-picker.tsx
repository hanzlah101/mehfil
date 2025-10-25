import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FormControl } from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"

/**
 * Render a date-picker button that opens a calendar popover for selecting a single date.
 *
 * @param value - The currently selected date, or `undefined`/falsy when no date is selected.
 * @param onChange - Callback invoked with the newly selected date (or `undefined` to clear selection).
 * @param disabled - When `true`, disables both the trigger button and calendar interaction.
 * @returns The date picker JSX element.
 */
export function DatePicker({
  value,
  onChange,
  disabled
}: {
  value: Date
  onChange: (val?: Date) => void
  disabled: boolean
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            disabled={disabled}
            className={cn(
              "w-full pl-3 text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            {value ? format(value, "PPP") : <span>Pick a date</span>}
            <CalendarIcon className="ml-auto opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          disabled={disabled}
          selected={value}
          onSelect={onChange}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}