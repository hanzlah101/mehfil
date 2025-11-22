import { formatPrice } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useAddonModal } from "@/stores/use-addon-modal"
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
  RiShoppingCart2Line
} from "@remixicon/react"

const btnClasses =
  "size-6 hover:bg-muted hover:text-foreground dark:hover:bg-muted/30"

export function AddonItem(addon: Doc<"addons">) {
  const openAddonModal = useAddonModal((s) => s.onOpen)

  const totalPrice = addon.qty * addon.unitPrice

  return (
    <li
      key={addon._id}
      className="group/item relative space-y-3 rounded-lg border bg-card p-4 transition-shadow hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-foreground">
            {addon.name}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {addon.qty} {addon.unit}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-sm font-medium">
          <RiShoppingCart2Line className="size-3.5" />
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <Protected perm={["update:addon", "delete:addon"]} operator="or">
        <div className="absolute top-0 right-4 z-10 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border bg-background p-0.5 group-hover/item:flex">
          <Protected perm="update:addon">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => openAddonModal("update", addon)}
                  className={btnClasses}
                >
                  <RiEdit2Fill className="size-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Addon</TooltipContent>
            </Tooltip>
          </Protected>

          <Protected perm="delete:addon">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => openAddonModal("delete", addon)}
                  className={btnClasses}
                >
                  <RiDeleteBinFill className="size-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Addon</TooltipContent>
            </Tooltip>
          </Protected>
        </div>
      </Protected>
    </li>
  )
}

AddonItem.Skeleton = function AddonItemSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-2 h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>
    </div>
  )
}
