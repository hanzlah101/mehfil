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

export type MealItemSchema = z.infer<typeof mealItemSchema>

export const mealSchema = z.object({
  title: z.string().min(1, "Please enter meal title"),
  items: z
    .array(mealItemSchema)
    .min(1, "Please add at least one item to the meal")
    .max(50, "Maximum 50 items allowed per meal")
})

export type MealSchema = z.infer<typeof mealSchema>
