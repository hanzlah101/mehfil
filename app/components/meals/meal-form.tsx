import { revalidateLogic, useStore } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import { toast } from "sonner"
import { mealSchema, type MealSchema } from "@/validations/meals"
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from "@convex-dev/react-query"
import { api } from "@db/_generated/api"
import { useMealModal } from "@/stores/use-meal-modal"
import { useAppForm } from "@/hooks/form-hooks"
import { RiDeleteBin6Line, RiAddLine } from "@remixicon/react"

const emptyNumber = undefined as unknown as number

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
          qty: emptyNumber,
          unitPrice: emptyNumber
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

        <div>
          <h3 className="mb-3 text-sm font-semibold">Meal Items</h3>

          <form.AppField name="items" mode="array">
            {(itemsField) => (
              <itemsField.Field>
                {itemsField.state.value.map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-4 rounded-lg border p-4"
                  >
                    <div className="grid gap-[inherit] md:grid-cols-2">
                      <form.AppField name={`items[${i}].name`}>
                        {(field) => (
                          <field.Field>
                            <field.Label required>Item Name</field.Label>
                            <field.Control>
                              <Input
                                placeholder="e.g., Chicken Biryani"
                                disabled={isPending}
                                value={field.state.value}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                              />
                            </field.Control>
                            <field.Error />
                          </field.Field>
                        )}
                      </form.AppField>

                      <form.AppField name={`items[${i}].unit`}>
                        {(field) => (
                          <field.Field>
                            <field.Label required>Unit</field.Label>
                            <field.Control>
                              <Input
                                placeholder="e.g., kg, ltr"
                                disabled={isPending}
                                value={field.state.value}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                              />
                            </field.Control>
                            <field.Error />
                          </field.Field>
                        )}
                      </form.AppField>

                      <form.AppField name={`items[${i}].qty`}>
                        {(field) => (
                          <field.Field>
                            <field.Label required>Quantity</field.Label>
                            <field.Control>
                              <NumberInput
                                min={1}
                                inputMode="numeric"
                                placeholder="20"
                                disabled={isPending}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(value) =>
                                  field.handleChange(value as number)
                                }
                              />
                            </field.Control>
                            <field.Error />
                          </field.Field>
                        )}
                      </form.AppField>

                      <form.AppField name={`items[${i}].unitPrice`}>
                        {(field) => (
                          <field.Field>
                            <field.Label required>Unit Price</field.Label>
                            <field.Control>
                              <NumberInput
                                min={0}
                                inputMode="numeric"
                                placeholder="100"
                                disabled={isPending}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(value) =>
                                  field.handleChange(value as number)
                                }
                              />
                            </field.Control>
                            <field.Error />
                          </field.Field>
                        )}
                      </form.AppField>
                    </div>

                    {itemsField.state.value.length > 1 && (
                      <Button
                        size="sm"
                        type="button"
                        disabled={isPending}
                        variant="destructive"
                        onClick={() => itemsField.removeValue(i)}
                      >
                        <RiDeleteBin6Line size={16} />
                        Remove Item
                      </Button>
                    )}
                  </div>
                ))}

                {itemsField.state.value.length < 50 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() =>
                      itemsField.pushValue({
                        name: "",
                        unit: "",
                        qty: emptyNumber,
                        unitPrice: emptyNumber
                      })
                    }
                    className="w-full"
                  >
                    <RiAddLine size={16} />
                    Add Item
                  </Button>
                )}

                {itemsField.state.meta.errors[0] && (
                  <p className="text-sm text-destructive">
                    {String(itemsField.state.meta.errors[0])}
                  </p>
                )}
              </itemsField.Field>
            )}
          </form.AppField>
        </div>

        <div className="sticky bottom-0 z-10 w-full bg-background py-4">
          <Button type="submit" className="w-full" loading={isPending}>
            {initialValues ? "Save Changes" : "Create Meal"}
          </Button>
        </div>
      </form.Group>
    </form.Form>
  )
}
