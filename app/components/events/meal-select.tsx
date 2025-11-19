"use client"

import { useState } from "react"
import { api } from "@db/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { Button } from "@/components/ui/button"
import { useFormContext } from "@/hooks/form-hooks"
import { useQuery } from "@tanstack/react-query"
import { FieldControl } from "@/components/ui/field"
import type { EventSchema } from "@/validations/events"
import {
  RiArrowDownSLine,
  RiCheckLine,
  RiRestaurantFill
} from "@remixicon/react"
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

export function MealSelect() {
  const form = useFormContext<EventSchema>()
  const { data: meals = [] } = useQuery(convexQuery(api.meals.list, {}))

  const [open, setOpen] = useState(false)

  return (
    <form.AppField name="meal.mealId">
      {(field) => (
        <field.Field>
          <field.Label>Meal</field.Label>

          <Popover modal open={open} onOpenChange={setOpen}>
            <FieldControl>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full px-3">
                  <RiRestaurantFill className="text-muted-foreground opacity-50" />
                  {field.state.value
                    ? meals?.find((m) => m._id === field.state.value)?.title
                    : "Select meal"}
                  <RiArrowDownSLine className="ml-auto text-muted-foreground opacity-50" />
                </Button>
              </PopoverTrigger>
            </FieldControl>

            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
              <Command>
                <CommandInput placeholder="Search meals..." />
                <CommandEmpty>No meal found.</CommandEmpty>

                <CommandGroup>
                  {meals?.map((meal) => (
                    <CommandItem
                      key={meal._id}
                      value={meal.title}
                      onSelect={() => {
                        const shouldUpdate =
                          !field.state.value ||
                          confirm(
                            "Previous meal items will be reset. Continue?"
                          )

                        if (shouldUpdate) {
                          field.handleChange(meal._id)
                          form.setFieldValue("meal.items", meal.items)
                          setOpen(false)
                        }

                        setOpen(false)
                      }}
                    >
                      <RiRestaurantFill className="text-muted-foreground opacity-50" />
                      {meal.title}
                      {meal._id === field.state.value && (
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
