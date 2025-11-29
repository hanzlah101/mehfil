"use client"

import { useState } from "react"
import { useFormContext } from "@/hooks/form-hooks"
import { Button } from "@/components/ui/button"
import { useStore } from "@tanstack/react-form"
import {
  RiArrowDownSLine,
  RiCheckLine,
  RiCalendarEventFill
} from "@remixicon/react"
import type { EventSchema } from "@/validations/events"
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandEmpty
} from "@/components/ui/command"

const EVENT_TYPES = [
  { value: "Barat", label: "Barat" },
  { value: "Walima", label: "Walima" },
  { value: "Mehandi", label: "Mehandi" },
  { value: "Birthday", label: "Birthday" },
  { value: "Party", label: "Party" }
] as const

export function EventTypeSelect() {
  const form = useFormContext<EventSchema>()
  const [open, setOpen] = useState(false)

  const selectedType = useStore(form.store, (state) => state.values.type)
  const selectedTypeLabel = EVENT_TYPES.find(
    (t) => t.value === selectedType
  )?.label

  return (
    <form.AppField name="type">
      {(field) => (
        <field.Field>
          <field.Label required>Event Type</field.Label>

          <Popover modal open={open} onOpenChange={setOpen}>
            <field.Control>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full px-3">
                  <RiCalendarEventFill className="text-muted-foreground opacity-50" />
                  {selectedTypeLabel || "Select event type"}
                  <RiArrowDownSLine className="ml-auto text-muted-foreground opacity-50" />
                </Button>
              </PopoverTrigger>
            </field.Control>

            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
              <Command>
                <CommandInput placeholder="Search event types..." />
                <CommandEmpty>No event type found.</CommandEmpty>

                <CommandGroup>
                  {EVENT_TYPES.map((eventType) => (
                    <CommandItem
                      key={eventType.value}
                      keywords={[eventType.label]}
                      onSelect={() => {
                        field.handleChange(eventType.value)
                        setOpen(false)
                      }}
                    >
                      <RiCalendarEventFill className="text-muted-foreground opacity-50" />
                      {eventType.label}
                      {eventType.value === field.state.value && (
                        <RiCheckLine className="ml-auto" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <field.Error />
        </field.Field>
      )}
    </form.AppField>
  )
}
