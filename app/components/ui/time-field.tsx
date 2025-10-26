import * as React from "react"

import { cn } from "@/lib/utils"
import { format, set } from "date-fns"
import { Input } from "@/components/ui/input"

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
        if (value && !isNaN(hours) && !isNaN(minutes)) {
          onChange(set(value, { hours, minutes }))
        }
      }}
      {...props}
    />
  )
}
