import { useMemo } from "react"
import type { Doc } from "@db/_generated/dataModel"
import type { MealSchema } from "@/validations/meals"
import {
  mealDocToFormSchema,
  isPackageMeal,
  isItemsMeal,
  filterMealItems,
  filterMealMenuItems,
  createEmptyMealItem,
  createEmptyMealMenuItem,
  countMealItemsWithData,
  type MealType
} from "@/lib/meal-utils"

export function useMealFormDefaults(
  meal: Doc<"meals"> | undefined
): MealSchema {
  return useMemo(() => mealDocToFormSchema(meal), [meal])
}

export function useMealType(
  meal: Doc<"meals"> | MealSchema | undefined
): MealType {
  return useMemo(() => meal?.type ?? "package", [meal])
}

export function useIsPackageMeal(
  meal: Doc<"meals"> | MealSchema | undefined
): boolean {
  return useMemo(() => (meal ? isPackageMeal(meal) : false), [meal])
}

export function useIsItemsMeal(
  meal: Doc<"meals"> | MealSchema | undefined
): boolean {
  return useMemo(() => (meal ? isItemsMeal(meal) : false), [meal])
}

export function useMealItems(meal: Doc<"meals"> | undefined) {
  return useMemo(() => {
    if (!meal) return []
    return filterMealItems(meal.items)
  }, [meal])
}

export function useMealMenuItems(meal: Doc<"meals"> | undefined) {
  return useMemo(() => {
    if (!meal) return undefined
    return filterMealMenuItems(meal.items)
  }, [meal])
}

export function useMealItemHelpers() {
  return useMemo(
    () => ({
      createEmpty: createEmptyMealItem,
      createEmptyMenuItem: createEmptyMealMenuItem,
      countWithData: countMealItemsWithData
    }),
    []
  )
}
