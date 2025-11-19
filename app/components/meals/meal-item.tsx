import { formatPrice } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useMealModal } from "@/stores/use-meal-modal"
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

export function MealItem(meal: Doc<"meals">) {
  const openMealModal = useMealModal((s) => s.onOpen)
  const deleteMealModal = useMealModal((s) => s.onOpen)

  const totalPrice = meal.items.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  )
  const itemCount = meal.items.length

  return (
    <li
      key={meal._id}
      className="group/item relative space-y-3 rounded-lg border bg-card p-4 transition-shadow hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-foreground">
            {meal.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-sm font-medium">
          <RiShoppingCart2Line className="size-3.5" />
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <div className="max-h-24 space-y-1.5 overflow-y-auto">
        {meal.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs text-muted-foreground"
          >
            <span className="truncate">
              {item.name}{" "}
              <span className="opacity-70">
                ({item.qty} {item.unit})
              </span>
            </span>
            <span className="ml-2 shrink-0 font-medium text-foreground">
              {formatPrice(item.qty * item.unitPrice)}
            </span>
          </div>
        ))}
      </div>

      <Protected perm={["update:meal", "delete:meal"]} operator="or">
        <div className="absolute top-0 right-4 z-10 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border bg-background p-0.5 group-hover/item:flex">
          <Protected perm="update:meal">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => openMealModal("update", meal)}
                  className={btnClasses}
                >
                  <RiEdit2Fill className="size-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Meal</TooltipContent>
            </Tooltip>
          </Protected>

          <Protected perm="delete:meal">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => deleteMealModal("delete", meal)}
                  className={btnClasses}
                >
                  <RiDeleteBinFill className="size-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Meal</TooltipContent>
            </Tooltip>
          </Protected>
        </div>
      </Protected>
    </li>
  )
}

MealItem.Skeleton = function MealItemSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-2 h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  )
}
