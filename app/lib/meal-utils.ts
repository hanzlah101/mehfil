import { match } from "ts-pattern"
import type { Doc } from "@db/_generated/dataModel"
import type {
  MealSchema,
  MealItemSchema,
  MealMenuItemSchema
} from "@/validations/meals"
import { EMPTY_NUMBER } from "@/lib/constants"

// Type definitions
export type MealItem = MealItemSchema
export type MealMenuItem = MealMenuItemSchema
export type MealType = MealSchema["type"]
export type MealDoc = Doc<"meals">
export type MealItemsUnion = MealDoc["items"]

// Type guards
export function isMealItem(item: unknown): item is MealItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "qty" in item &&
    "unit" in item &&
    "unitPrice" in item &&
    typeof (item as MealItem).qty === "number" &&
    typeof (item as MealItem).unit === "string" &&
    typeof (item as MealItem).unitPrice === "number"
  )
}

export function isMealMenuItem(item: unknown): item is MealMenuItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "name" in item &&
    !("qty" in item)
  )
}

export function isPackageMeal(
  meal: MealDoc | MealSchema
): meal is Extract<MealDoc | MealSchema, { type: "package" }> {
  return meal.type === "package"
}

export function isItemsMeal(
  meal: MealDoc | MealSchema
): meal is Extract<MealDoc | MealSchema, { type: "items" }> {
  return meal.type === "items"
}

// Filter utilities
export function filterMealItems(items: MealItemsUnion | undefined): MealItem[] {
  if (!items || !Array.isArray(items)) return []
  const filtered: MealItem[] = []
  for (const item of items) {
    if (isMealItem(item)) {
      filtered.push(item)
    }
  }
  return filtered
}

export function filterMealMenuItems(
  items: MealItemsUnion | undefined
): MealMenuItem[] | undefined {
  if (!items || !Array.isArray(items)) return undefined
  const filtered: MealMenuItem[] = []
  for (const item of items) {
    if (isMealMenuItem(item)) {
      filtered.push(item)
    }
  }
  return filtered.length > 0 ? filtered : undefined
}

// Conversion utilities
export function mealDocToFormSchema(meal: MealDoc | undefined): MealSchema {
  if (!meal) {
    return {
      type: "package",
      title: "",
      pricePerHead: 0,
      items: undefined
    }
  }

  return match(meal.type)
    .with("package", () => {
      const menuItems = filterMealMenuItems(meal.items)
      return {
        type: "package" as const,
        title: meal.title,
        pricePerHead: meal.pricePerHead ?? 0,
        items: menuItems
      } satisfies MealSchema
    })
    .with("items", () => {
      const items = filterMealItems(meal.items)
      return {
        type: "items" as const,
        title: meal.title,
        items:
          items.length > 0
            ? items
            : [
                {
                  name: "",
                  unit: "",
                  qty: EMPTY_NUMBER,
                  unitPrice: EMPTY_NUMBER
                }
              ]
      } satisfies MealSchema
    })
    .exhaustive()
}

export function createEmptyMealItem(): MealItem {
  return {
    name: "",
    unit: "",
    qty: EMPTY_NUMBER,
    unitPrice: EMPTY_NUMBER
  }
}

export function createEmptyMealMenuItem(): MealMenuItem {
  return {
    name: ""
  }
}

// Meal item validation utilities
export function hasMealItemData(item: MealItem): boolean {
  return Boolean(item.name) || item.qty > 0 || item.unitPrice > 0
}

export function countMealItemsWithData(items: MealItem[]): number {
  return items.filter(hasMealItemData).length
}

// Pattern matching helper for meal types
export function matchMealType<T>(
  meal: MealDoc | MealSchema | undefined,
  handlers: {
    package: (meal: Extract<MealDoc | MealSchema, { type: "package" }>) => T
    items: (meal: Extract<MealDoc | MealSchema, { type: "items" }>) => T
    default?: () => T
  }
): T {
  if (!meal) {
    return (
      handlers.default?.() ??
      handlers.package({
        type: "package",
        title: "",
        pricePerHead: 0,
        items: undefined
      } as Extract<MealDoc | MealSchema, { type: "package" }>)
    )
  }

  return match(meal.type)
    .with("package", () =>
      handlers.package(
        meal as Extract<MealDoc | MealSchema, { type: "package" }>
      )
    )
    .with("items", () =>
      handlers.items(meal as Extract<MealDoc | MealSchema, { type: "items" }>)
    )
    .exhaustive()
}
