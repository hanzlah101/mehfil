import { useMemo } from "react"
import { useEventModal } from "@/stores/use-event-modal"
import { convexQuery } from "@convex-dev/react-query"
import { api } from "@db/_generated/api"
import { useQuery } from "@tanstack/react-query"
import { formatPrice, calculateBillTotals } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentStatusAlert } from "@/components/events/event-bill/payment-status-alert"
import { BillPDF } from "@/pdfs/bill-pdf"
import { usePrintPDF } from "@/hooks/use-print-pdf"
import {
  RiPrinterFill,
  RiRestaurantFill,
  RiPriceTag3Fill,
  RiStarFill
} from "@remixicon/react"

export function PrintBill({ onBack }: { onBack: () => void }) {
  const eventId = useEventModal((s) => s.event?._id)
  const { data: event } = useQuery(
    convexQuery(api.events.getById, eventId ? { id: eventId } : "skip")
  )
  const { data: tenant } = useQuery(convexQuery(api.tenant.get, {}))

  const billTotals = useMemo(() => {
    if (!event) return null
    return calculateBillTotals({
      meal: event.meal ?? null,
      addons: event.addons ?? null,
      discountAmt: event.discountAmt ?? null,
      pax: event.pax ?? null
    })
  }, [event])

  const { printPDF, isPrinting } = usePrintPDF()

  if (!event || !billTotals) return null

  const { subtotal, grandTotal, discountAmount, discountPercentage } =
    billTotals
  const amountPaid = event.amountPaid

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Bill Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Addons */}
          {event.addons && event.addons.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RiStarFill className="size-4" />
                <span className="font-medium">Addons</span>
              </div>
              <div className="ml-6 space-y-1.5 border-l pl-3">
                {event.addons.map((addon, index) => (
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

          {/* Meal Items */}
          {event.meal && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RiRestaurantFill className="size-4" />
                <span className="font-medium">
                  {event.mealName ||
                    (event.meal.type === "package"
                      ? "Meal Package"
                      : "Meal Items")}
                </span>
              </div>
              <div className="ml-6 space-y-1.5 border-l pl-3">
                {event.meal.type === "package" ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Package (Per Head: {formatPrice(event.meal.pricePerHead)})
                        {event.pax && (
                          <span className="ml-2">× {event.pax} guests</span>
                        )}
                      </span>
                      <span className="font-medium text-muted-foreground">
                        {formatPrice(
                          event.meal.pricePerHead * (event.pax ?? 0)
                        )}
                      </span>
                    </div>
                    {event.meal.items && event.meal.items.length > 0 && (
                      <div className="ml-4 text-xs text-muted-foreground">
                        {event.meal.items.map((item, idx) => (
                          <span key={idx}>
                            {idx > 0 && ", "}
                            {item.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  event.meal.items.map((item, index) => (
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
                  ))
                )}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t" />

          {/* Subtotal */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Subtotal</span>
            <span className="text-sm font-semibold">
              {formatPrice(subtotal)}
            </span>
          </div>

          {/* Discount */}
          {discountAmount > 0 && (
            <div className="space-y-1 rounded-lg border border-green-200 bg-green-50/50 p-3 dark:border-green-900/30 dark:bg-green-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                  <RiPriceTag3Fill className="size-4" />
                  <span>Discount</span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                    -{formatPrice(discountAmount)}
                  </span>
                  <span className="text-xs text-green-600/80 dark:text-green-400/80">
                    ({discountPercentage}% off)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Grand Total */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Grand Total</span>
              <span className="text-xl font-bold">
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>

          {/* Payment Status */}
          <PaymentStatusAlert
            meal={event.meal ?? null}
            addons={event.addons ?? null}
            discountAmt={event.discountAmt ?? null}
            pax={event.pax ?? null}
            amountPaid={amountPaid}
            variant="descriptive"
          />
        </CardContent>
      </Card>

      {/* Print Button */}
      <div className="sticky bottom-0 z-10 grid grid-cols-2 gap-3 bg-background pt-2 pb-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          disabled={isPrinting}
          loading={isPrinting}
          onClick={() => printPDF(<BillPDF event={event} tenant={tenant} />)}
        >
          <RiPrinterFill className="size-4" />
          Print Bill
        </Button>
      </div>
    </div>
  )
}
