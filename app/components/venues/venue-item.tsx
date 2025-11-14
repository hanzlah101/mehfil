import { cn, formatPrice } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useVenueModal } from "@/stores/use-venue-modal"
import { EVENT_COLOR_CLASSES, getEventColorStyles } from "@/lib/colors"
import { Protected } from "@/components/protected"
import type { Doc } from "@db/_generated/dataModel"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import {
  RiDeleteBinFill,
  RiEdit2Fill,
  RiGroupLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine
} from "@remixicon/react"

const btnClasses =
  "size-6 hover:bg-(--bg-light) hover:text-(--text-light) dark:hover:bg-(--bg-dark)/30 dark:hover:text-(--text-dark)"

export function VenueItem(venue: Doc<"venues">) {
  const openVenueModal = useVenueModal((s) => s.onOpen)
  const colorClasses = EVENT_COLOR_CLASSES.slice(0, -1)

  return (
    <li
      key={venue._id}
      style={getEventColorStyles(venue.color)}
      className={cn(
        "group/item relative w-full space-y-2 rounded-md px-4 py-3",
        colorClasses
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold">{venue.name}</h3>
        <div className="flex items-center gap-1.5 rounded-md bg-black/5 px-2 py-1 text-sm font-medium dark:bg-white/5">
          <RiMoneyDollarCircleLine className="size-4" />
          <span>{formatPrice(venue.charges)}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <div className="flex items-center gap-1.5 opacity-70">
          <RiGroupLine className="size-3.5" />
          <span>{venue.capacity} guests</span>
        </div>
        {venue.location && (
          <div className="flex items-center gap-1.5 opacity-70">
            <RiMapPinLine className="size-3.5" />
            <span className="line-clamp-1">{venue.location}</span>
          </div>
        )}
      </div>

      <Protected perm={["update:venue", "delete:venue"]} operator="or">
        <div
          className={cn(
            "absolute top-0 right-4 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-current/30 p-0.5 transition-normal group-hover/item:flex",
            colorClasses
          )}
        >
          <Protected perm="update:venue">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => openVenueModal("update", venue)}
                  className={btnClasses}
                >
                  <RiEdit2Fill className="size-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Venue</TooltipContent>
            </Tooltip>
          </Protected>

          <Protected perm="delete:venue">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className={btnClasses}
                  onClick={() => openVenueModal("delete", venue)}
                >
                  <RiDeleteBinFill className="size-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Venue</TooltipContent>
            </Tooltip>
          </Protected>
        </div>
      </Protected>
    </li>
  )
}

VenueItem.Skeleton = function VenueItemSkeleton() {
  return (
    <li className="w-full space-y-1 rounded-md bg-muted/50 px-4 py-3">
      <Skeleton className="h-6 w-full max-w-1/2 rounded" />
      <Skeleton className="h-5 w-full max-w-3/4 rounded" />
    </li>
  )
}
