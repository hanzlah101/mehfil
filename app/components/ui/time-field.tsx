import * as React from "react"

import { cn } from "@/lib/utils"
import { format, set } from "date-fns"
import { Input } from "@/components/ui/input"

/**
 * Render a time-only input that is synchronized with a Date value.
 *
 * The input displays the provided Date's hours and minutes as "HH:mm" and updates
 * the original Date's hours and minutes when the user changes the input.
 *
 * @param className - Optional additional CSS class names applied to the input
 * @param value - Date whose time portion (hours and minutes) populates the input
 * @param onChange - Callback invoked with the original `value` updated to the selected time
 * @returns The Input element configured with `type="time"` and the provided props
 */
export function TimeField({
  className,
  value,
  onChange,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "onChange" | "value" | "type"> & {
  value: Date
  onChange: (val: Date) => void
}) {
  return (
    <Input
      type="time"
      value={value ? format(value, "HH:mm") : ""}
      className={cn(
        "appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
        className
      )}
      onChange={(evt) => {
        const [hours, minutes] = evt.target.value.split(":").map(Number)
        onChange(set(value, { hours, minutes }))
      }}
      {...props}
    />
  )
}