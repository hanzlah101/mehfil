"use client"

import { useState } from "react"
import { api } from "@db/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { Button } from "@/components/ui/button"
import { useFormContext } from "@/hooks/form-hooks"
import { useQuery } from "@tanstack/react-query"
import { FieldControl } from "@/components/ui/field"
import type { EventSchema } from "@/validations/events"
import type { MealItemSchema } from "@/validations/meals"
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
                          if (meal.type === "package") {
                            form.setFieldValue("meal", {
                              mealId: meal._id,
                              type: "package",
                              pricePerHead: meal.pricePerHead ?? 0,
                              items: meal.items ?? []
                            })
                          } else {
                            const items = meal.items ?? []
                            form.setFieldValue("meal", {
                              mealId: meal._id,
                              type: "items",
                              items: Array.isArray(items)
                                ? items.filter(
                                    (item): item is MealItemSchema =>
                                      item &&
                                      typeof item === "object" &&
                                      "qty" in item &&
                                      "unit" in item &&
                                      "unitPrice" in item
                                  )
                                : []
                            })
                          }
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
