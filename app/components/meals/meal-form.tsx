import { revalidateLogic, useStore } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { mealSchema, type MealSchema } from "@/validations/meals"
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from "@convex-dev/react-query"
import { api } from "@db/_generated/api"
import { useMealModal } from "@/stores/use-meal-modal"
import { EMPTY_NUMBER } from "@/lib/constants"
import { useAppForm } from "@/hooks/form-hooks"
import { MealItemsField } from "./meal-items-field"

export function MealForm() {
  const closeMealModal = useMealModal((s) => s.onClose)
  const initialValues = useMealModal((s) => s.meal)

  const { mutateAsync: createMeal } = useMutation({
    mutationFn: useConvexMutation(api.meals.create),
    onSuccess: () => {
      closeMealModal()
      toast.success("New Meal Created!")
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create meal"
      )
    }
  })

  const { mutateAsync: updateMeal } = useMutation({
    mutationFn: useConvexMutation(api.meals.update),
    onSuccess: () => {
      closeMealModal()
      toast.success("Meal Updated Successfully!")
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update meal"
      )
    }
  })

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: mealSchema
    },
    defaultValues: {
      title: initialValues?.title ?? "",
      items: initialValues?.items ?? [
        {
          name: "",
          unit: "",
          qty: EMPTY_NUMBER,
          unitPrice: EMPTY_NUMBER
        }
      ]
    } satisfies MealSchema as MealSchema,
    onSubmit: async ({ formApi, value }) => {
      if (initialValues) {
        await updateMeal({ id: initialValues._id, ...value })
      } else {
        await createMeal(value)
      }
      formApi.reset()
    }
  })

  const isPending = useStore(form.store, (s) => s.isSubmitting)

  return (
    <form.Form>
      <form.Group>
        <form.AppField name="title">
          {(field) => (
            <field.Field>
              <field.Label required>Meal Title</field.Label>
              <field.Control>
                <Input
                  autoFocus
                  placeholder="e.g., Biryani Combo"
                  disabled={isPending}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </field.Control>
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        <MealItemsField />

        <div className="sticky bottom-0 z-10 w-full bg-background py-4">
          <Button type="submit" className="w-full" loading={isPending}>
            {initialValues ? "Save Changes" : "Create Meal"}
          </Button>
        </div>
      </form.Group>
    </form.Form>
  )
}
