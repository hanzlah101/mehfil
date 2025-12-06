import { useMemo } from "react"
import { calculateBillTotals, formatPrice } from "@/lib/utils"
import { RiCheckboxCircleFill, RiTimeLine } from "@remixicon/react"
import type { Doc } from "@db/_generated/dataModel"
import type { UpdateEventBillSchema } from "@/validations/events"

type PaymentStatusAlertProps = {
  meal?: Doc<"events">["meal"] | UpdateEventBillSchema["meal"] | null
  addons?: Doc<"events">["addons"] | null
  discountAmt?: number | null
  pax?: number | null
  amountPaid: number
  variant?: "minimal" | "descriptive"
}

export function PaymentStatusAlert({
  meal,
  addons,
  discountAmt,
  pax,
  amountPaid,
  variant = "minimal"
}: PaymentStatusAlertProps) {
  const billTotals = useMemo(
    () =>
      calculateBillTotals({
        meal: meal ?? null,
        addons: addons ?? null,
        discountAmt: discountAmt ?? null,
        pax: pax ?? null
      }),
    [meal, addons, discountAmt, pax]
  )

  const remaining = useMemo(
    () => billTotals.grandTotal - amountPaid,
    [billTotals.grandTotal, amountPaid]
  )
  const isFullyPaid = useMemo(() => remaining <= 0, [remaining])

  if (variant === "minimal") {
    if (isFullyPaid) {
      return (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50/50 p-2 dark:border-green-900/30 dark:bg-green-950/20">
          <RiCheckboxCircleFill className="size-4 text-green-600 dark:text-green-400" />
          <div className="flex-1">
            <div className="text-xs font-semibold text-green-700 dark:text-green-400">
              Fully Paid
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/50 p-2 dark:border-amber-900/30 dark:bg-amber-950/20">
        <RiTimeLine className="size-4 text-amber-600 dark:text-amber-400" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              Remaining
            </span>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              {formatPrice(remaining)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Descriptive variant
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Amount Paid</span>
        <span className="font-medium">{formatPrice(amountPaid)}</span>
      </div>

      {isFullyPaid ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50/50 p-3 dark:border-green-900/30 dark:bg-green-950/20">
          <RiCheckboxCircleFill className="size-5 text-green-600 dark:text-green-400" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-green-700 dark:text-green-400">
              Fully Paid
            </div>
            <div className="text-xs text-green-600/80 dark:text-green-400/80">
              Payment completed
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900/30 dark:bg-amber-950/20">
          <RiTimeLine className="size-5 text-amber-600 dark:text-amber-400" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                Remaining Amount
              </span>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                {formatPrice(remaining)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
