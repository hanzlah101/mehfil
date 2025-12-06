import * as React from "react"
import { useMemo } from "react"
import { format } from "date-fns"
import {
  RiCalendarFill,
  RiTimeFill,
  RiUserFill,
  RiPhoneFill,
  RiMailFill,
  RiGroupFill,
  RiMapPinFill,
  RiEdit2Fill,
  RiDeleteBinFill,
  RiRestaurantFill,
  RiCalendarCheckFill,
  RiArrowDownSLine,
  RiPriceTag3Fill,
  RiPrinterFill,
  RiStarFill,
  RiMore2Fill,
  RiCloseCircleFill
} from "@remixicon/react"

import { cn, formatPrice, calculateBillTotals } from "@/lib/utils"
import { Protected } from "@/components/protected"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/copy-button"
import { getMealTypeFromTimes, formatMealType } from "@/lib/date"
import { PaymentStatusAlert } from "@/components/events/event-bill/payment-status-alert"
import { DAY_DATE_FORMAT, EVENT_STATUS_CLASSES } from "@/lib/constants"
import { useEventModal, type EventWithVenue } from "@/stores/use-event-modal"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function EventListItem({ event }: { event: EventWithVenue }) {
  const openEventModal = useEventModal((s) => s.onOpen)
  const [isOpen, setIsOpen] = React.useState(false)

  const billTotals = useMemo(
    () =>
      calculateBillTotals({
        meal: event.meal,
        addons: event.addons,
        discountAmt: event.discountAmt,
        pax: event.pax
      }),
    [event.meal, event.addons, event.discountAmt, event.pax]
  )
  const { subtotal, grandTotal, discountAmount: discount } = billTotals
  const isCancelled = event.status === "cancelled"
  const pendingRefund =
    isCancelled && event.amountPaid > 0 ? event.amountPaid : 0

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full [&_svg]:shrink-0"
    >
      <div className="rounded-lg border bg-card">
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-foreground">
                  #{event.serialCode}
                </span>
                <h3 className="text-lg leading-tight font-semibold">
                  {event.title}
                </h3>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                  EVENT_STATUS_CLASSES[event.status]
                )}
              >
                {event.status}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="data-[state=open]:bg-accent"
                >
                  <RiMore2Fill className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => openEventModal("print-bill", event)}
                >
                  <RiPrinterFill className="size-4" />
                  Print Bill
                </DropdownMenuItem>
                <Protected perm="update:event">
                  <DropdownMenuItem
                    onClick={() => openEventModal("update", event)}
                  >
                    <RiEdit2Fill className="size-4" />
                    Edit Event
                  </DropdownMenuItem>
                </Protected>
                {event.status !== "cancelled" && (
                  <Protected perm="update:event">
                    <DropdownMenuItem
                      onClick={() => openEventModal("cancel-event", event)}
                      variant="destructive"
                    >
                      <RiCloseCircleFill className="size-4" />
                      Cancel Event
                    </DropdownMenuItem>
                  </Protected>
                )}
                <Protected perm="delete:event">
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => openEventModal("delete", event)}
                    variant="destructive"
                  >
                    <RiDeleteBinFill className="size-4" />
                    Delete Event
                  </DropdownMenuItem>
                </Protected>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center gap-1.5 text-sm opacity-70">
              <RiMapPinFill className="size-3.5 text-muted-foreground" />
              <span>
                {event.venue.name}
                {event.venue.location && ` • ${event.venue.location}`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 opacity-70">
              <RiCalendarFill className="size-3.5 text-muted-foreground" />
              <span>{format(event.startTime, DAY_DATE_FORMAT)}</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-70">
              <RiTimeFill className="size-3.5 text-muted-foreground" />
              <span>
                {formatMealType(
                  getMealTypeFromTimes(event.startTime, event.endTime)
                )}
              </span>
            </div>
            {typeof event.pax === "number" && (
              <div className="flex items-center gap-1.5 opacity-70">
                <RiGroupFill className="size-3.5 text-muted-foreground" />
                <span>{event.pax} guests</span>
              </div>
            )}
          </div>

          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full">
              {isOpen ? "Less details" : "More details"}
              <RiArrowDownSLine
                className={cn(
                  "size-3.5 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <div className="space-y-3 border-t px-4 pt-3 pb-4">
            {isCancelled && (
              <div className="rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-900/30 dark:bg-red-950/20">
                <div className="flex items-start gap-2">
                  <RiCloseCircleFill className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
                  <div className="flex-1 space-y-2">
                    <div className="text-sm font-semibold text-red-700 dark:text-red-400">
                      Event Cancelled
                    </div>
                    {event.cancellationReason && (
                      <div className="text-xs whitespace-pre-wrap text-red-600/80 dark:text-red-400/80">
                        {event.cancellationReason}
                      </div>
                    )}
                    {pendingRefund > 0 && (
                      <div className="flex items-center justify-between border-t border-red-200 pt-1 dark:border-red-900/30">
                        <span className="text-xs font-medium text-red-700 dark:text-red-400">
                          Pending Refund:
                        </span>
                        <span className="text-sm font-bold text-red-700 dark:text-red-400">
                          {formatPrice(pendingRefund)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-sm opacity-70">
              <RiCalendarCheckFill className="size-3.5 text-muted-foreground" />
              <span className="font-medium">Booked on:</span>
              <span>{format(event.bookingDate, DAY_DATE_FORMAT)}</span>
            </div>

            {event.guestArrival && (
              <div className="flex items-center gap-1.5 text-sm opacity-70">
                <RiTimeFill className="size-3.5 text-muted-foreground" />
                <span className="font-medium">Guest Arrival:</span>
                <span>{event.guestArrival}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-sm opacity-70">
              <RiRestaurantFill className="size-3.5 text-muted-foreground" />
              <span className="font-medium">Food Service:</span>
              <span>{event.withFood ? "Yes" : "No"}</span>
            </div>

            <div className="space-y-3 rounded-md border bg-muted/30 p-3">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Billing Summary
              </p>

              <div className="space-y-2">
                {event.addons && event.addons.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-sm opacity-70">
                      <RiStarFill className="size-3.5 text-muted-foreground" />
                      <span>Addons</span>
                    </div>
                    <div className="ml-5 space-y-1">
                      {event.addons.map((addon, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="opacity-60">
                            {addon.name} ({addon.qty} {addon.unit})
                          </span>
                          <span className="font-medium opacity-60">
                            {formatPrice(addon.qty * addon.unitPrice)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {event.meal && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-sm opacity-70">
                      <RiRestaurantFill className="size-3.5 text-muted-foreground" />
                      <span>
                        {event.mealName ||
                          (event.meal.type === "package"
                            ? "Meal Package"
                            : "Meal Items")}
                      </span>
                    </div>
                    <div className="ml-5 space-y-1">
                      {event.meal.type === "package" ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="opacity-60">
                              Package (Per Head:{" "}
                              {formatPrice(event.meal.pricePerHead)})
                              {event.pax && (
                                <span className="ml-2">
                                  × {event.pax} guests
                                </span>
                              )}
                            </span>
                            <span className="font-medium opacity-60">
                              {formatPrice(
                                event.meal.pricePerHead * (event.pax ?? 0)
                              )}
                            </span>
                          </div>
                          {event.meal.items && event.meal.items.length > 0 && (
                            <div className="ml-4 text-xs opacity-50">
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
                            <span className="opacity-60">
                              {item.name} ({item.qty} {item.unit})
                            </span>
                            <span className="font-medium opacity-60">
                              {formatPrice(item.qty * item.unitPrice)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <div className="border-t pt-2">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                      <RiPriceTag3Fill className="size-3.5" />
                      <span>Discount</span>
                    </div>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}

                <div className="rounded-md border bg-background/50 p-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Grand Total</span>
                    <span className="text-lg font-bold">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Amount Paid</span>
                    <span className="font-medium opacity-70">
                      {formatPrice(event.amountPaid)}
                    </span>
                  </div>
                  {!isCancelled && (
                    <PaymentStatusAlert
                      meal={event.meal}
                      addons={event.addons}
                      discountAmt={event.discountAmt}
                      pax={event.pax}
                      amountPaid={event.amountPaid}
                      variant="minimal"
                    />
                  )}
                  {isCancelled && pendingRefund > 0 && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/50 p-2 dark:border-red-900/30 dark:bg-red-950/20">
                      <RiCloseCircleFill className="size-4 text-red-600 dark:text-red-400" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                            Refund Due
                          </span>
                          <span className="text-xs font-bold text-red-700 dark:text-red-400">
                            {formatPrice(pendingRefund)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {(event.customerName ||
              event.customerEmail ||
              event.customerPhone) && (
              <div className="space-y-2 rounded-md border bg-muted/30 p-3">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Customer Details
                </p>

                {event.customerName && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <RiUserFill className="size-3.5 text-muted-foreground" />
                    <span className="flex-1 truncate">
                      {event.customerName}
                    </span>
                    <CopyButton text={event.customerName} />
                  </div>
                )}

                {event.customerEmail && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <RiMailFill className="size-3.5 text-muted-foreground" />
                    <span className="flex-1 truncate">
                      {event.customerEmail}
                    </span>
                    <CopyButton text={event.customerEmail} />
                  </div>
                )}

                {event.customerPhone && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <RiPhoneFill className="size-3.5 text-muted-foreground" />
                    <span className="flex-1">{event.customerPhone}</span>
                    <CopyButton text={event.customerPhone} />
                  </div>
                )}
              </div>
            )}

            {event.notes && (
              <div className="rounded-md border bg-muted/30 p-3">
                <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Notes
                </p>
                <p className="text-sm whitespace-pre-wrap opacity-70">
                  {event.notes}
                </p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

EventListItem.Skeleton = function EventItemSkeleton() {
  return (
    <div className="w-full space-y-3 rounded-lg border bg-muted/50 px-4 py-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-4 w-32 rounded" />
      </div>
      <Skeleton className="h-4 w-full rounded" />
    </div>
  )
}
