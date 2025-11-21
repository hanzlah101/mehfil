import { useFormContext } from "@/hooks/form-hooks"
import { Input } from "@/components/ui/input"
import { useStore } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { RiDeleteBin6Line } from "@remixicon/react"
import { NumberInput } from "@/components/ui/number-input"
import type { EventSchema } from "@/validations/events"

export function AddonItemsField({ fieldName }: { fieldName: string }) {
  const form = useFormContext<EventSchema>()
  const isPending = useStore(form.store, (s) => s.isSubmitting)

  const itemsFieldName = fieldName as "addons"

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold">Addon Items</h3>

      <form.AppField name={itemsFieldName} mode="array">
        {(itemsField) => (
          <itemsField.Field>
            {itemsField.state.value?.map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 rounded-lg border p-4"
              >
                <div className="grid gap-[inherit] md:grid-cols-2">
                  <form.AppField name={`${itemsFieldName}[${i}].name`}>
                    {(field) => (
                      <field.Field>
                        <field.Label required>Item Name</field.Label>
                        <field.Control>
                          <Input
                            placeholder="e.g., AC Charges"
                            disabled={isPending}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                        </field.Control>
                        <field.Error />
                      </field.Field>
                    )}
                  </form.AppField>

                  <form.AppField name={`${itemsFieldName}[${i}].unit`}>
                    {(field) => (
                      <field.Field>
                        <field.Label required>Unit</field.Label>
                        <field.Control>
                          <Input
                            placeholder="e.g., Per Hour"
                            disabled={isPending}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                        </field.Control>
                        <field.Error />
                      </field.Field>
                    )}
                  </form.AppField>

                  <form.AppField name={`${itemsFieldName}[${i}].qty`}>
                    {(field) => (
                      <field.Field>
                        <field.Label required>Quantity</field.Label>
                        <field.Control>
                          <NumberInput
                            min={1}
                            inputMode="numeric"
                            placeholder="1"
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

                  <form.AppField name={`${itemsFieldName}[${i}].unitPrice`}>
                    {(field) => (
                      <field.Field>
                        <field.Label required>Unit Price</field.Label>
                        <field.Control>
                          <NumberInput
                            min={0}
                            inputMode="numeric"
                            placeholder="1000"
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
              </div>
            ))}
            <itemsField.Error />
          </itemsField.Field>
        )}
      </form.AppField>
    </div>
  )
}
