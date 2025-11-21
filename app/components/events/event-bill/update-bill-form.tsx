import { useMemo } from "react"
import { useEventModal } from "@/stores/use-event-modal"
import { Button } from "@/components/ui/button"
import { NumberInput } from "@/components/ui/number-input"
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from "@convex-dev/react-query"
import { api } from "@db/_generated/api"
import { revalidateLogic, useStore } from "@tanstack/react-form"
import { EMPTY_NUMBER } from "@/lib/constants"
import { useAppForm, useFormContext } from "@/hooks/form-hooks"
import { MealSelect } from "@/components/events/meal-select"
import { MealItemsField } from "@/components/meals/meal-items-field"
import { AddonSelect } from "@/components/events/addon-select"
import { AddonItemsField } from "@/components/events/addon-items-field"
import { getDirtyValues, calculateBillTotals, formatPrice } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { convexQuery } from "@convex-dev/react-query"
import { PaymentStatusAlert } from "@/components/events/event-bill/payment-status-alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  updateEventBillSchema,
  type UpdateEventBillSchema
} from "@/validations/events"
import {
  RiRestaurantFill,
  RiPriceTag3Fill,
  RiStarFill
} from "@remixicon/react"

export function UpdateBillForm({ onContinue }: { onContinue: () => void }) {
  const initialEvent = useEventModal((s) => s.event)
  const { data } = useQuery(
    convexQuery(
      api.events.getById,
      initialEvent ? { id: initialEvent._id } : "skip"
    )
  )

  const event = data ?? initialEvent

  const { mutateAsync: updateEventBill } = useMutation({
    mutationFn: useConvexMutation(api.events.update)
  })

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: updateEventBillSchema
    },
    defaultValues: {
      discountedTotal: event?.discountedTotal ?? null,
      meal: event?.meal,
      addons: event?.addons,
      pax: event?.pax ?? EMPTY_NUMBER,
      amountPaid: event?.amountPaid ?? 0
    } satisfies UpdateEventBillSchema as UpdateEventBillSchema,
    onSubmit: async ({ formApi }) => {
      if (!event) return

      const dirtyValues = getDirtyValues(formApi)

      if (dirtyValues) {
        await updateEventBill({ id: event._id, ...dirtyValues } as Parameters<
          typeof updateEventBill
        >[0])
      }

      onContinue()
      formApi.reset()
    }
  })

  const isPending = useStore(form.store, (s) => s.isSubmitting)

  return (
    <form.Form>
      <form.Group>
        <form.AppField name="pax">
          {(field) => (
            <field.Field>
              <field.Label>PAX</field.Label>
              <field.Control>
                <NumberInput
                  placeholder="300"
                  disabled={isPending}
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  onBlur={field.handleBlur}
                />
              </field.Control>
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        <AddonFields />

        <MealFields />

        <form.AppField name="discountedTotal">
          {(field) => (
            <field.Field>
              <field.Label>Discounted Total (Optional)</field.Label>
              <field.Control>
                <NumberInput
                  min={0}
                  inputMode="numeric"
                  placeholder="50,000"
                  disabled={isPending}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value as number)}
                />
              </field.Control>
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="amountPaid">
          {(field) => (
            <field.Field>
              <field.Label required>Amount Paid</field.Label>
              <field.Control>
                <NumberInput
                  min={0}
                  inputMode="numeric"
                  placeholder="20,000"
                  disabled={isPending}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value as number)}
                />
              </field.Control>
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        <BillSummary />

        <div className="sticky bottom-0 z-10 w-full bg-background py-4">
          <Button type="submit" className="w-full" loading={isPending}>
            Continue
          </Button>
        </div>
      </form.Group>
    </form.Form>
  )
}

function AddonFields() {
  const form = useFormContext<UpdateEventBillSchema>()
  const addons = useStore(form.store, (s) => s.values.addons)

  return (
    <>
      <AddonSelect />
      {addons && addons.length > 0 && <AddonItemsField fieldName="addons" />}
    </>
  )
}

function MealFields() {
  const form = useFormContext<UpdateEventBillSchema>()
  const [mealId] = useStore(form.store, (s) => [s.values.meal?.mealId])

  if (!mealId) return null

  return (
    <>
      <MealSelect />
      {mealId && <MealItemsField fieldName="meal.items" />}
    </>
  )
}

function BillSummary() {
  const form = useFormContext<UpdateEventBillSchema>()

  const formValues = useStore(form.store, (s) => s.values)
  const billTotals = useMemo(
    () =>
      calculateBillTotals({
        meal: formValues.meal,
        addons: formValues.addons,
        discountedTotal: formValues.discountedTotal
      }),
    [formValues.meal, formValues.addons, formValues.discountedTotal]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Bill Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {formValues.addons && formValues.addons.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RiStarFill className="size-4" />
                <span>Addons</span>
              </div>
              <div className="ml-6 space-y-1">
                {formValues.addons.map((addon, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {addon.name} ({addon.qty} {addon.unit})
                    </span>
                    <span className="font-medium text-muted-foreground">
                      {formatPrice(addon.qty * addon.unitPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formValues.meal && formValues.meal.items.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RiRestaurantFill className="size-4" />
                <span>Meal Items</span>
              </div>
              <div className="ml-6 space-y-1">
                {formValues.meal.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {item.name} ({item.qty} {item.unit})
                    </span>
                    <span className="font-medium text-muted-foreground">
                      {formatPrice(item.qty * item.unitPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-2">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Subtotal</span>
              <span>{formatPrice(billTotals.subtotal)}</span>
            </div>
          </div>

          {billTotals.discountAmount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <RiPriceTag3Fill className="size-4" />
                <span>Discount ({billTotals.discountPercentage}% off)</span>
              </div>
              <span className="font-medium text-green-600 dark:text-green-400">
                -{formatPrice(billTotals.discountAmount)}
              </span>
            </div>
          )}

          <div className="rounded-md border bg-muted/50 p-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Grand Total</span>
              <span className="text-lg font-bold">
                {formatPrice(billTotals.grandTotal)}
              </span>
            </div>
          </div>

          <PaymentStatusAlert
            meal={formValues.meal}
            addons={formValues.addons}
            discountedTotal={formValues.discountedTotal}
            amountPaid={formValues.amountPaid ?? 0}
            variant="minimal"
          />
        </div>
      </CardContent>
    </Card>
  )
}
