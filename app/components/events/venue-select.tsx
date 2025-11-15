"use client"

import { useState } from "react"
import { useFormContext } from "@/hooks/form-hooks"
import { useQuery } from "@tanstack/react-query"
import { convexQuery } from "@convex-dev/react-query"
import { api } from "@db/_generated/api"
import { Button } from "@/components/ui/button"
import { FieldControl } from "@/components/ui/field"
import { useStore } from "@tanstack/react-form"
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

export function VenueSelect() {
  const form = useFormContext<EventSchema>()
  const { data: venues = [] } = useQuery(convexQuery(api.venues.list, {}))

  const [open, setOpen] = useState(false)

  const selectedVenueId = useStore(form.store, (state) => state.values.venueId)
  const selectedVenue = venues.find((v) => v._id === selectedVenueId)

  return (
    <form.AppField name="venueId">
      {(field) => (
        <field.Field>
          <field.Label>Venue</field.Label>

          <Popover open={open} onOpenChange={setOpen}>
            <FieldControl>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between px-3"
                >
                  {selectedVenue ? selectedVenue.name : "Pick a venue"}
                </Button>
              </PopoverTrigger>
            </FieldControl>

            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
              <Command>
                <CommandInput placeholder="Search venues..." />
                <CommandEmpty>No venue found.</CommandEmpty>

                <CommandGroup>
                  {venues.map((venue) => (
                    <CommandItem
                      key={venue._id}
                      value={venue.name}
                      onSelect={() => {
                        field.handleChange(venue._id)
                        form.setFieldValue("hallCharges", venue.charges)
                        setOpen(false)
                      }}
                    >
                      {venue.name}
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
