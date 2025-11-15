import { z } from "zod"
import { isAfter } from "date-fns"
import { dateSchema, emailSchema } from "@/validations/_utils"
import { mealSchema } from "./meals"

export const eventSchema = z
  .object({
    title: z.string().min(1, "Please enter event title"),
    notes: z.string().optional(),
    bookingDate: dateSchema("Please enter booking date"),
    startTime: dateSchema("Please enter start time"),
    endTime: dateSchema("Please enter end time"),
    type: z.enum(["reservation", "booking"], "Please select event type"),
    customerName: z.string().min(1, "Please enter customer name"),
    guestArrival: z.string().optional(),
    customerEmail: z.union([z.literal(""), emailSchema.optional()]),
    customerPhone: z.string().optional(),
    pax: z.optional(
      z.union([
        z.int("Invalid Pax").positive("Pax must be greater than 0"),
        z
          .object({
            from: z.int("Invalid Pax").positive("Pax must be greater than 0"),
            to: z.int("Invalid Pax").positive("Pax must be greater than 0")
          })
          .refine((val) => val.to > val.from, {
            error: "Max guests must be greater than start",
            path: ["to"]
          })
      ])
    ),
    withFood: z.boolean(),
    meal: z
      .object({
        mealId: z.string(),
        items: mealSchema.pick({ items: true })
      })
      .optional(),
    venueId: z.string().min(1, "Please select a venue")
  })
  .refine((val) => isAfter(val.endTime, val.startTime), {
    message: "End time must be later than the start time",
    path: ["endTime"]
  })

export type EventSchema = z.infer<typeof eventSchema>
