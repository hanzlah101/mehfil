"use client"

import { useFormContext } from "@/hooks/form-hooks"
import { useStore } from "@tanstack/react-form"
import { api } from "@db/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import { RiStarFill } from "@remixicon/react"
import type { EventSchema } from "@/validations/events"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue
} from "@/components/ui/multi-select"

export function AddonSelect() {
  const form = useFormContext<EventSchema>()
  const { data: addonPresets = [] } = useQuery(convexQuery(api.addons.list, {}))
  const selectedAddons = useStore(form.store, (s) => s.values.addons) ?? []

  const handleValuesChange = (ids: string[]) => {
    const newAddons: EventSchema["addons"] = []
    const existingAddons = selectedAddons

    for (const id of ids) {
      const existing = existingAddons.find((a) => a._id === id)
      if (existing) {
        newAddons.push(existing)
      } else {
        const addonPreset = addonPresets.find((a) => a._id === id)
        if (addonPreset) {
          newAddons.push({
            ...addonPreset,
            _id: addonPreset._id
          })
        }
      }
    }
    form.setFieldValue("addons", newAddons)
  }

  return (
    <form.AppField name="addons">
      {(field) => (
        <field.Field>
          <field.Label>Addons</field.Label>
          <MultiSelect
            values={selectedAddons.map((a) => a._id ?? "").filter(Boolean)}
            onValuesChange={handleValuesChange}
          >
            <field.Control>
              <MultiSelectTrigger>
                <RiStarFill className="text-muted-foreground opacity-50" />
                <MultiSelectValue placeholder="Select addons" />
              </MultiSelectTrigger>
            </field.Control>
            <MultiSelectContent>
              <MultiSelectGroup>
                {addonPresets.map((addon) => (
                  <MultiSelectItem
                    key={addon._id}
                    value={addon._id}
                    badgeLabel={addon.name}
                  >
                    <RiStarFill className="text-muted-foreground opacity-50" />
                    {addon.name}
                  </MultiSelectItem>
                ))}
              </MultiSelectGroup>
            </MultiSelectContent>
          </MultiSelect>
          <field.Error />
        </field.Field>
      )}
    </form.AppField>
  )
}
