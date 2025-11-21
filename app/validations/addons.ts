import { z } from "zod"

export const addonSchema = z.object({
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

export type AddonSchema = z.infer<typeof addonSchema>
