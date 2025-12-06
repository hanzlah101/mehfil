import { useFormContext } from "@/hooks/form-hooks"
import { useStore } from "@tanstack/react-form"
import { NumberInput } from "@/components/ui/number-input"
import { MealItemsField } from "@/components/meals/meal-items-field"
import { MealMenuItemsField } from "@/components/meals/meal-menu-items-field"
import type { EventSchema } from "@/validations/events"
import { api } from "@db/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"

export function MealConfig() {
  const form = useFormContext<EventSchema>()
  const mealId = useStore(form.store, (s) => s.values.meal?.mealId)
  const mealType = useStore(form.store, (s) => s.values.meal?.type)
  const { data: meals = [] } = useQuery(convexQuery(api.meals.list, {}))

  const selectedMeal = meals.find((m) => m._id === mealId)

  if (!selectedMeal) return null

  if (mealType === "package") {
    return (
      <div className="space-y-4">
        <form.AppField name="meal.pricePerHead">
          {(field) => (
            <field.Field>
              <field.Label required>Price Per Head</field.Label>
              <field.Control>
                <NumberInput
                  placeholder="1500"
                  min={0}
                  value={field.state.value ?? 0}
                  onChange={(val) => field.handleChange(val as number)}
                  onBlur={field.handleBlur}
                />
              </field.Control>
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        <MealMenuItemsField fieldName="meal.items" />
      </div>
    )
  }

  return <MealItemsField fieldName="meal.items" />
}
