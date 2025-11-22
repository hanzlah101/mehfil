import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TFormApi } from "@/lib/types"
import type { DeepKeys } from "@tanstack/react-form"
import type { Doc, Id } from "@db/_generated/dataModel"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  amount: number,
  options?: Intl.NumberFormatOptions
) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  }).format(amount)
}

export function getDirtyValues<TData>(
  form: TFormApi<TData>
): Partial<TData> | null {
  const fieldMeta = form.state.fieldMeta

  const dirtyFields = new Set<keyof TData>()

  for (const key in fieldMeta) {
    const meta = fieldMeta[key as DeepKeys<TData>]
    if (!meta?.isDirty) continue
    const topKey = key.split(".")[0] as keyof TData
    dirtyFields.add(topKey)
  }

  if (dirtyFields.size === 0) return null

  const fullValues = form.state.values
  const result = {} as Partial<TData>
  dirtyFields.forEach((k) => {
    result[k] = fullValues[k]
  })

  if (Object.keys(result).length === 0) return null

  return result
}

type MealItem = NonNullable<Doc<"events">["meal"]>["items"][number]
type AddonItem = NonNullable<Doc<"events">["addons"]>[number]

type BillCalculationInput = {
  meal?: {
    items: MealItem[]
    mealId?: Id<"meals"> | string
  } | null
  addons?: AddonItem[] | null
  discountedTotal?: Doc<"events">["discountedTotal"] | null
}

export function calculateBillTotals(input: BillCalculationInput) {
  const mealTotal = input.meal
    ? input.meal.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)
    : 0
  const addonsTotal = input.addons
    ? input.addons.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)
    : 0
  const subtotal = mealTotal + addonsTotal
  const discountedTotal = input.discountedTotal ?? null
  const grandTotal = discountedTotal ?? subtotal
  const discountAmount =
    discountedTotal !== null ? subtotal - discountedTotal : 0
  const discountPercentage =
    discountAmount > 0 && subtotal > 0
      ? Math.round((discountAmount / subtotal) * 100)
      : 0

  return {
    mealTotal,
    addonsTotal,
    subtotal,
    grandTotal,
    discountAmount,
    discountPercentage
  }
}
