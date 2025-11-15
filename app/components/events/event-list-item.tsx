import * as React from "react"
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
  RiMoneyDollarCircleFill,
  RiPriceTag3Fill,
  RiPrinterFill
} from "@remixicon/react"

import { cn, formatPrice } from "@/lib/utils"
import { Protected } from "@/components/protected"
import { Skeleton } from "@/components/ui/skeleton"
import { useEventModal } from "@/stores/use-event-modal"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/copy-button"
import type { Doc } from "@db/_generated/dataModel"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"

type EventWithVenue = Doc<"events"> & {
  mealName?: string | null
  venue: Doc<"venues">
}

export function EventListItem({ event }: { event: EventWithVenue }) {
  const openEventModal = useEventModal((s) => s.onOpen)
  const [isOpen, setIsOpen] = React.useState(false)

  const startTime = new Date(event.startTime)
  const endTime = new Date(event.endTime)
  const bookingDate = new Date(event.bookingDate)

  // Calculate totals
  const mealTotal = event.meal
    ? event.meal.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)
    : 0
  const subtotal = event.hallCharges + mealTotal
  const grandTotal = event.discountedTotal ?? subtotal
  const discount =
    event.discountedTotal !== null ? subtotal - event.discountedTotal : 0

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="rounded-lg border bg-card">
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg leading-tight font-semibold">
                  {event.title}
                </h3>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                    event.type === "booking"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  )}
                >
                  {event.type === "booking" ? "Booking" : "Reservation"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-sm opacity-70">
                <RiMapPinFill className="size-3.5 text-muted-foreground" />
                <span>{event.venue.name}</span>
                {event.venue.location && (
                  <>
                    <span className="opacity-50">•</span>
                    <span>{event.venue.location}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon-sm" variant="secondary">
                    <RiPrinterFill className="size-3.5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Print Bill</TooltipContent>
              </Tooltip>

              <Protected perm="update:event">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon-sm"
                      variant="secondary"
                      onClick={() => openEventModal("update", event)}
                    >
                      <RiEdit2Fill className="size-3.5 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Event</TooltipContent>
                </Tooltip>
              </Protected>

              <Protected perm="delete:event">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon-sm"
                      variant="destructive"
                      onClick={() => openEventModal("delete", event)}
                    >
                      <RiDeleteBinFill className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Event</TooltipContent>
                </Tooltip>
              </Protected>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center gap-1.5 opacity-70">
              <RiCalendarFill className="size-3.5 text-muted-foreground" />
              <span>{format(startTime, "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-70">
              <RiTimeFill className="size-3.5 text-muted-foreground" />
              <span>
                {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
              </span>
            </div>
            {event.pax && (
              <div className="flex items-center gap-1.5 opacity-70">
                <RiGroupFill className="size-3.5 text-muted-foreground" />
                <span>
                  {typeof event.pax === "number"
                    ? `${event.pax} guests`
                    : `${event.pax.from}-${event.pax.to} guests`}
                </span>
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
            <div className="flex items-center gap-1.5 text-sm opacity-70">
              <RiCalendarCheckFill className="size-3.5 text-muted-foreground" />
              <span className="font-medium">Booked on:</span>
              <span>{format(bookingDate, "MMM d, yyyy")}</span>
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
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 opacity-70">
                    <RiMoneyDollarCircleFill className="size-3.5 text-muted-foreground" />
                    <span>Hall Charges</span>
                  </div>
                  <span className="font-medium opacity-70">
                    {formatPrice(event.hallCharges)}
                  </span>
                </div>

                {event.meal && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-sm opacity-70">
                      <RiRestaurantFill className="size-3.5 text-muted-foreground" />
                      <span>{event.mealName || "Meal Items"}</span>
                    </div>
                    <div className="ml-5 space-y-1">
                      {event.meal.items.map((item, index) => (
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
                      ))}
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
