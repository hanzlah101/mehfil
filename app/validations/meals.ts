import { z } from "zod"

const mealItemSchema = z.object({
  name: z.string().min(1, "Please enter item name"),
  unit: z.string().min(1, "Please enter unit"),
  qty: z
    .number({
      error: ({ code }) =>
        code === "invalid_type" ? "Please enter a valid quantity" : undefined
    })
    .positive("Quantity must be greater than 0"),
  unitPrice: z
    .number({
      error: ({ code }) =>
        code === "invalid_type" ? "Please enter a valid price" : undefined
    })
    .nonnegative("Unit price cannot be negative")
})

const mealMenuItemSchema = z.object({
  name: z.string().min(1, "Please enter item name")
})

export type MealItemSchema = z.infer<typeof mealItemSchema>
export type MealMenuItemSchema = z.infer<typeof mealMenuItemSchema>

export const mealSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal("package"),
      title: z.string().min(1, "Please enter meal title"),
      pricePerHead: z
        .number({
          error: ({ code }) =>
            code === "invalid_type"
              ? "Please enter a valid price per head"
              : undefined
        })
        .positive("Price per head must be greater than 0"),
      items: z.array(mealMenuItemSchema).optional()
    }),
    z.object({
      type: z.literal("items"),
      title: z.string().min(1, "Please enter meal title"),
      items: z
        .array(mealItemSchema)
        .min(1, "Please add at least one item to the meal")
        .max(50, "Maximum 50 items allowed per meal")
    })
  ])

export type MealSchema = z.infer<typeof mealSchema>
